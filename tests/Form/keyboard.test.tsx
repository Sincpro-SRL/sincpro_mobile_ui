import { expect, jest, test } from "@jest/globals";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import KeyboardToolbarHost from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { createRef, type ElementType, type ReactNode } from "react";
import { Platform, Text, type TextInputInstance } from "react-native";

const mockToolbarProps: { current?: Record<string, unknown> } = {};

jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = require("react-native");
  const Container = ({ children, ...props }: { children: ReactNode }) =>
    mockReact.createElement(View, props, children);
  const Toolbar = (props: Record<string, unknown>) => {
    mockToolbarProps.current = props;
    return mockReact.createElement(View, { testID: "keyboard-toolbar" });
  };
  return {
    KeyboardAwareScrollView: Container,
    KeyboardToolbar: Object.assign(Toolbar, { Group: Container }),
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

function onPlatform(os: "ios" | "android") {
  jest.replaceProperty(Platform, "OS", os);
}

test("iOS mounts one library toolbar and every form reserves its height", async () => {
  onPlatform("ios");
  await render(
    <>
      <KeyboardForm testID="form-scroll">
        <Input label="Nombre" value="" />
      </KeyboardForm>
      <KeyboardToolbarHost />
    </>,
  );
  expect(screen.getAllByTestId("keyboard-toolbar")).toHaveLength(1);
  expect(mockToolbarProps.current?.doneText).toBe("Listo");
  expect(screen.getByTestId("form-scroll").props.bottomOffset).toBe(42 + 24);
  expect(screen.getByTestId("form-scroll").props.keyboardShouldPersistTaps).toBe("handled");
});

test("Android follows the IME action key: no toolbar and no reserved height", async () => {
  onPlatform("android");
  await render(
    <>
      <KeyboardForm testID="form-scroll">
        <Input label="Nombre" value="" />
      </KeyboardForm>
      <KeyboardToolbarHost />
    </>,
  );
  expect(screen.queryByTestId("keyboard-toolbar")).toBeNull();
  expect(screen.getByTestId("form-scroll").props.bottomOffset).toBe(24);
});

test("Android can opt in to the toolbar", async () => {
  onPlatform("android");
  await render(<KeyboardToolbarHost android doneLabel="Terminar" />);
  expect(screen.getByTestId("keyboard-toolbar")).toBeTruthy();
  expect(mockToolbarProps.current?.doneText).toBe("Terminar");
});

test("toolbar actions are announced in Spanish with a 44-point target", async () => {
  onPlatform("ios");
  await render(<KeyboardToolbarHost />);
  const Button = mockToolbarProps.current?.button as ElementType;
  const press = jest.fn();
  await render(
    <>
      <Button accessibilityHint="" accessibilityLabel="Next" onPress={press}>
        <Text>›</Text>
      </Button>
      <Button accessibilityHint="" accessibilityLabel="Previous" onPress={jest.fn()}>
        <Text>‹</Text>
      </Button>
      <Button accessibilityHint="" accessibilityLabel="Done" onPress={jest.fn()}>
        <Text>Listo</Text>
      </Button>
    </>,
  );
  const next = screen.getByRole("button", { name: "Campo siguiente" });
  expect(next.props.style).toMatchObject({ minWidth: 44, minHeight: 42 });
  expect(screen.getByRole("button", { name: "Campo anterior" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Ocultar teclado" })).toBeTruthy();
  await fireEvent.press(next);
  expect(press).toHaveBeenCalledTimes(1);
});

test("keyboard form reserves sticky CTA plus toolbar clearance without replacing public offsets", async () => {
  onPlatform("ios");
  const { rerender } = await render(
    <>
      <KeyboardForm stickyFooterHeight={64} testID="sticky-form">
        <Input label="Último campo" value="" />
      </KeyboardForm>
      <KeyboardToolbarHost />
    </>,
  );
  expect(screen.getByTestId("sticky-form").props.bottomOffset).toBe(64 + 42 + 24);
  await rerender(
    <>
      <KeyboardForm bottomOffset={200} stickyFooterHeight={80} testID="sticky-form">
        <Input label="Último campo" value="" />
      </KeyboardForm>
      <KeyboardToolbarHost />
    </>,
  );
  expect(screen.getByTestId("sticky-form").props.bottomOffset).toBe(200);
});

test("Form.Input forwards the native instance ref for return-key navigation", async () => {
  const ref = createRef<TextInputInstance>();
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

test("ScrollContainer is a KeyboardForm: same keyboard clearance, native iOS insets", async () => {
  onPlatform("ios");
  await render(
    <>
      <ScrollContainer testID="page-scroll">
        <Input label="Notas" value="" />
      </ScrollContainer>
      <KeyboardToolbarHost />
    </>,
  );
  const scroll = screen.getByTestId("page-scroll");
  expect(scroll.props.bottomOffset).toBe(42 + 24);
  expect(scroll.props.contentInsetAdjustmentBehavior).toBe("automatic");
  expect(scroll.props.keyboardShouldPersistTaps).toBe("handled");
});

