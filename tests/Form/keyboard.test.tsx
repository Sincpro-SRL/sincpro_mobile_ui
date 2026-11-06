import { beforeEach, expect, jest, test } from "@jest/globals";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import KeyboardToolbar from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { type ComponentRef, createRef } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { FocusedInputEvents, KeyboardController } from "react-native-keyboard-controller";
import type { KeyboardAwareScrollViewRef } from "react-native-keyboard-controller";

let mockKeyboardVisible = true;
const mockAssureVisible = jest.fn();
beforeEach(() => {
  mockKeyboardVisible = true;
});

jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View, Text } = require("react-native");
  const Container = ({ children, ...props }: { children: React.ReactNode }) =>
    mockReact.createElement(View, props, children);
  const Scroll = ({
    ref,
    ...props
  }: {
    children: React.ReactNode;
    ref?: React.Ref<{ assureFocusedInputVisible: typeof mockAssureVisible }>;
  }) => {
    mockReact.useImperativeHandle(ref, () => ({
      assureFocusedInputVisible: mockAssureVisible,
    }));
    return mockReact.createElement(Container, props);
  };
  const Part = ({
    button: Button,
    children,
    text,
  }: {
    button: React.ElementType;
    children?: React.ReactNode;
    text?: string;
  }) =>
    mockReact.createElement(Button, {
      onPress: jest.fn(),
      children: children ?? (text ? mockReact.createElement(Text, {}, text) : null),
    });
  return {
    FocusedInputEvents: { addListener: jest.fn(() => ({ remove: jest.fn() })) },
    KeyboardController: { setFocusTo: jest.fn(), dismiss: jest.fn() },
    KeyboardStickyView: Container,
    KeyboardAwareScrollView: Scroll,
    KeyboardToolbar: Object.assign(Container, {
      Group: Container,
      Prev: Part,
      Next: Part,
      Done: Part,
    }),
    useKeyboardState: (selector: (value: { isVisible: boolean }) => boolean) =>
      selector({ isVisible: mockKeyboardVisible }),
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("keyboard form owns one scroll, reserves toolbar clearance and permits first-tap controls", async () => {
  const { rerender } = await render(
    <KeyboardForm testID="form-scroll">
      <Input label="Nombre" value="" />
    </KeyboardForm>,
  );
  expect(screen.getByTestId("form-scroll").props.bottomOffset).toBe(72);
  expect(screen.getByTestId("form-scroll").props.keyboardShouldPersistTaps).toBe("handled");
  expect(screen.getByRole("button", { name: "Campo siguiente" })).toBeTruthy();
  await fireEvent(screen.getByTestId("keyboard-toolbar"), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 88 } },
  });
  expect(screen.getByTestId("form-scroll").props.bottomOffset).toBe(112);
  await rerender(
    <KeyboardForm bottomOffset={90} toolbar={false} testID="form-scroll">
      <Input label="Nombre" value="" />
    </KeyboardForm>,
  );
  expect(screen.getByTestId("form-scroll").props.bottomOffset).toBe(90);
  expect(screen.queryByRole("button", { name: "Campo siguiente" })).toBeNull();
});

test("toolbar labels are localizable and its actions have 48-point non-overlapping targets", async () => {
  await render(
    <KeyboardToolbar
      doneLabel="Close keyboard"
      nextLabel="Next field"
      previousLabel="Previous field"
    />,
  );
  const next = screen.getByRole("button", { name: "Next field" });
  expect(StyleSheet.flatten(next.props.style)).toMatchObject({ minWidth: 48, minHeight: 48 });
  expect(next.props.hitSlop).toBe(0);
  expect(screen.getByRole("button", { name: "Close keyboard" })).toBeTruthy();
});

test("compact toolbar keeps names accessible without forcing visible text", async () => {
  const { rerender } = await render(<KeyboardToolbar />);
  expect(screen.getByRole("button", { name: "Ocultar teclado" })).toBeTruthy();
  expect(screen.queryByText("Ocultar teclado")).toBeNull();
  await rerender(
    <KeyboardToolbar labelStyle={{ fontSize: 12, fontFamily: "CustomFont" }} showDoneLabel />,
  );
  expect(StyleSheet.flatten(screen.getByText("Ocultar teclado").props.style)).toMatchObject({
    fontSize: 12,
    fontFamily: "CustomFont",
  });
});

test("custom content and geometry retain native actions, names and disabled states", async () => {
  await render(
    <KeyboardToolbar
      actionStyle={{ borderRadius: 24 }}
      className="rounded-full"
      renderActionContent={(action, state) => (
        <Text>{`${action}:${state.disabled ? "off" : "on"}`}</Text>
      )}
      style={{ borderRadius: 28, paddingHorizontal: 16 }}
    />,
  );
  expect(
    StyleSheet.flatten(screen.getByTestId("keyboard-toolbar").props.style),
  ).toMatchObject({
    borderRadius: 28,
    paddingHorizontal: 16,
  });
  const next = screen.getByRole("button", { name: "Campo siguiente" });
  expect(StyleSheet.flatten(next.props.style)).toMatchObject({ borderRadius: 24 });
  expect(screen.getByText("next:off")).toBeTruthy();
  const listener = jest.mocked(FocusedInputEvents.addListener).mock.calls.at(-1)?.[1];
  if (!listener) throw new Error("Missing native focus subscription");
  await act(() => listener({ current: 1, count: 3 }));
  expect(screen.getByText("next:on")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Campo siguiente" }));
  expect(KeyboardController.setFocusTo).toHaveBeenLastCalledWith("next");
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar teclado" }));
  expect(KeyboardController.dismiss).toHaveBeenCalled();
});

test("KeyboardForm forwards native scroll ref and composes toolbar overrides", async () => {
  const ref = createRef<KeyboardAwareScrollViewRef>();
  await render(
    <KeyboardForm
      ref={ref}
      toolbarLabels={{ doneLabel: "Legacy close label" }}
      toolbarProps={{ doneLabel: "Cerrar edición", showDoneLabel: true }}
    >
      <Input label="Campo" value="" />
    </KeyboardForm>,
  );
  ref.current?.assureFocusedInputVisible();
  expect(mockAssureVisible).toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Cerrar edición" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Legacy close label" })).toBeNull();
});

test("toolbar follows native group boundaries and delegates focus traversal", async () => {
  await render(<KeyboardToolbar />);
  const listener = jest.mocked(FocusedInputEvents.addListener).mock.calls.at(-1)?.[1];
  if (!listener) throw new Error("Missing native focus subscription");
  await act(() => listener({ current: 1, count: 3 }));
  await fireEvent.press(screen.getByRole("button", { name: "Campo siguiente" }));
  expect(KeyboardController.setFocusTo).toHaveBeenLastCalledWith("next");
  await fireEvent.press(screen.getByRole("button", { name: "Campo anterior" }));
  expect(KeyboardController.setFocusTo).toHaveBeenLastCalledWith("prev");
  await act(() => listener({ current: 2, count: 3 }));
  expect(
    screen.getByRole("button", { name: "Campo siguiente" }).props.accessibilityState.disabled,
  ).toBe(true);
});

test("closed keyboard toolbar stays mounted but inaccessible", async () => {
  const { rerender } = await render(<KeyboardToolbar />);
  mockKeyboardVisible = false;
  await rerender(<KeyboardToolbar />);
  expect(screen.queryByRole("button", { name: "Campo siguiente" })).toBeNull();
  expect(
    screen.getByTestId("keyboard-toolbar", { includeHiddenElements: true }),
  ).toBeTruthy();
});

test("Form.Input forwards the native instance ref for return-key navigation", async () => {
  const ref = createRef<ComponentRef<typeof TextInput>>();
  const submit = jest.fn();
  await render(
    <Input
      label="Nombre"
      onSubmitEditing={submit}
      ref={ref}
      returnKeyType="next"
      submitBehavior="submit"
      value=""
    />,
  );
  expect(typeof ref.current?.focus).toBe("function");
  await fireEvent(screen.getByLabelText("Nombre"), "submitEditing", {
    nativeEvent: { text: "" },
  });
  expect(submit).toHaveBeenCalledTimes(1);
});
