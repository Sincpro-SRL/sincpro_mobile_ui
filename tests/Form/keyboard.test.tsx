import { beforeEach, expect, jest, test } from "@jest/globals";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import KeyboardToolbar from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { type ComponentRef, createRef } from "react";
import { TextInput } from "react-native";
import { FocusedInputEvents, KeyboardController } from "react-native-keyboard-controller";

let mockKeyboardVisible = true;
beforeEach(() => {
  mockKeyboardVisible = true;
});

jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View, Text } = require("react-native");
  const Container = ({ children, ...props }: { children: React.ReactNode }) =>
    mockReact.createElement(View, props, children);
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
    KeyboardAwareScrollView: Container,
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
  expect(next.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  expect(next.props.hitSlop).toBe(0);
  expect(screen.getByRole("button", { name: "Close keyboard" })).toBeTruthy();
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
