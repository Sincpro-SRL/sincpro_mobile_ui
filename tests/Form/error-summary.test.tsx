import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import type { ErrorSummaryItem, ErrorSummaryProps } from "@sincpro/mobile-ui/Form";
import ErrorSummary from "@sincpro/mobile-ui/Form/Form.ErrorSummary";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ComponentRef, createRef, StrictMode, useState } from "react";
import { AccessibilityInfo, StyleSheet, Text, TextInput, View } from "react-native";

jest.mock("react-native-keyboard-controller", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const Container = (props: React.ComponentProps<typeof View>) =>
    React.createElement(View, props);
  return {
    KeyboardAwareScrollView: Container,
    KeyboardToolbar: { Group: Container },
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

beforeEach(() => {
  jest
    .spyOn(AccessibilityInfo, "announceForAccessibility")
    .mockImplementation(() => {})
    .mockClear();
});
afterEach(() => {
  jest.restoreAllMocks();
});

const errors: readonly ErrorSummaryItem[] = [
  {
    id: "email",
    label: "Correo electrónico",
    message: "Escribe un correo válido.",
  },
  {
    id: "name",
    label: "Nombre completo",
    message: "Escribe tu nombre completo.",
  },
];
const defaultTitle = "Revisa los siguientes errores";

test("empty errors render nothing and do not announce or select", async () => {
  const select = jest.fn();
  await render(<ErrorSummary errors={[]} onSelectError={select} testID="summary" />);
  expect(screen.queryByTestId("summary")).toBeNull();
  expect(screen.queryByRole("header")).toBeNull();
  expect(screen.queryByRole("button")).toBeNull();
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
  expect(select).not.toHaveBeenCalled();
});

test("readonly items keep their order and exact multiline messages in named 48-point buttons", async () => {
  const message = "  Escribe el correo completo.\nNo omitas el dominio.  ";
  const ordered: readonly ErrorSummaryItem[] = [{ ...errors[0], message }, errors[1]];
  const select = jest.fn();
  await render(<ErrorSummary errors={ordered} onSelectError={select} />);
  expect(screen.getByRole("header", { name: defaultTitle })).toBeTruthy();
  const buttons = screen.getAllByRole("button");
  expect(buttons.map(({ props }) => props.accessibilityLabel)).toEqual(
    ordered.map(({ label, message }) => `${label}: ${message}`),
  );
  for (const button of buttons) {
    const style = StyleSheet.flatten(button.props.style);
    expect(style).toMatchObject({ minWidth: 48, minHeight: 48 });
    expect(style.height).toBeUndefined();
    expect(button.props.hitSlop).toBe(0);
  }
  const text = screen.getByText(message, { normalizer: (text) => text });
  expect(text.props.children).toBe(message);
  expect(text.props.allowFontScaling).toBe(true);
  expect(text.props.numberOfLines).toBe(0);
  await fireEvent.press(buttons[0]);
  expect(select).toHaveBeenCalledWith("email");
  await fireEvent.press(buttons[1]);
  expect(select).toHaveBeenLastCalledWith("name");
});

test.each([{ custom: false }, { custom: true }])(
  "first-tap selection calls native ref.focus and preserves drafts (custom content: $custom)",
  async ({ custom }) => {
    const name = createRef<ComponentRef<typeof TextInput>>();
    const email = createRef<ComponentRef<typeof TextInput>>();
    function DraftForm({ errors }: { errors: readonly ErrorSummaryItem[] }) {
      const [values, setValues] = useState({ name: "Ana sin terminar", email: "ana@" });
      return (
        <KeyboardForm testID="form-scroll" toolbar={false}>
          <ErrorSummary
            errors={errors}
            onSelectError={(id) => {
              if (id === "name") name.current?.focus();
              if (id === "email") email.current?.focus();
            }}
            renderErrorContent={
              custom
                ? (error, index) => (
                    <View testID={`custom-error-${index}`}>
                      <Text allowFontScaling numberOfLines={0}>
                        {index + 1}
                      </Text>
                      <Text allowFontScaling numberOfLines={0}>
                        {error.message}
                      </Text>
                    </View>
                  )
                : undefined
            }
            renderHeader={
              custom
                ? (title) => (
                    <Text allowFontScaling numberOfLines={0} testID="custom-header">
                      {title}
                    </Text>
                  )
                : undefined
            }
          />
          <Input
            error={errors.find(({ id }) => id === "name")?.message}
            label="Nombre completo"
            onChangeText={(text) => setValues((current) => ({ ...current, name: text }))}
            ref={name}
            value={values.name}
          />
          <Input
            error={errors.find(({ id }) => id === "email")?.message}
            label="Correo electrónico"
            onChangeText={(text) => setValues((current) => ({ ...current, email: text }))}
            ref={email}
            value={values.email}
          />
        </KeyboardForm>
      );
    }
    const { rerender } = await render(<DraftForm errors={[]} />);
    if (!name.current || !email.current) throw new Error("Missing native input refs");
    const focusName = jest.spyOn(name.current, "focus").mockClear();
    const focusEmail = jest.spyOn(email.current, "focus").mockClear();
    await rerender(<DraftForm errors={errors} />);
    expect(focusName).not.toHaveBeenCalled();
    expect(focusEmail).not.toHaveBeenCalled();
    expect(screen.getByTestId("form-scroll").props.keyboardShouldPersistTaps).toBe("handled");
    for (const { message } of errors) expect(screen.getAllByText(message)).toHaveLength(2);
    expect(screen.getByRole("header", { name: defaultTitle })).toBeTruthy();
    if (custom) {
      expect(screen.getByTestId("custom-header").props.children).toBe(defaultTitle);
      for (const [index, error] of errors.entries()) {
        expect(screen.getByTestId(`custom-error-${index}`)).toBeTruthy();
        expect(
          StyleSheet.flatten(
            screen.getByRole("button", { name: `${error.label}: ${error.message}` }).props
              .style,
          ),
        ).toMatchObject({ minWidth: 48, minHeight: 48 });
      }
    }
    await fireEvent.changeText(screen.getByLabelText("Nombre completo"), "Ana editando");
    await fireEvent.changeText(screen.getByLabelText("Correo electrónico"), "ana@borrador");
    expect(focusName).not.toHaveBeenCalled();
    expect(focusEmail).not.toHaveBeenCalled();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
    await fireEvent.press(
      screen.getByRole("button", { name: "Correo electrónico: Escribe un correo válido." }),
    );
    expect(focusEmail.mock.contexts.filter((input) => input === email.current)).toHaveLength(
      1,
    );
    expect(focusName.mock.contexts).not.toContain(name.current);
    await fireEvent.press(
      screen.getByRole("button", { name: "Nombre completo: Escribe tu nombre completo." }),
    );
    expect(focusName.mock.contexts.filter((input) => input === name.current)).toHaveLength(1);
    expect(focusEmail.mock.contexts.filter((input) => input === email.current)).toHaveLength(
      1,
    );
    expect(screen.getByLabelText("Nombre completo").props.value).toBe("Ana editando");
    expect(screen.getByLabelText("Correo electrónico").props.value).toBe("ana@borrador");
  },
);

test("announces only the first nonempty render of each episode, not error or title updates", async () => {
  const select = jest.fn();
  const { rerender } = await render(
    <ErrorSummary errors={[]} onSelectError={select} testID="summary" />,
  );
  await rerender(<ErrorSummary errors={errors} onSelectError={select} testID="summary" />);
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith(
    `${defaultTitle}\nCorreo electrónico: Escribe un correo válido.\nNombre completo: Escribe tu nombre completo.`,
  );
  await rerender(
    <ErrorSummary
      errors={[{ ...errors[1], message: "Completa el nombre." }]}
      onSelectError={select}
      title="Comprueba los datos"
    />,
  );
  await rerender(
    <ErrorSummary
      errors={[...errors].reverse()}
      onSelectError={jest.fn()}
      title="Nuevo título"
    />,
  );
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
  await rerender(<ErrorSummary errors={[]} onSelectError={select} testID="summary" />);
  expect(screen.queryByTestId("summary")).toBeNull();
  await rerender(
    <ErrorSummary errors={[errors[1]]} onSelectError={select} title="Comprueba los datos" />,
  );
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(2);
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith(
    "Comprueba los datos\nNombre completo: Escribe tu nombre completo.",
  );
});

test("announce=false lets the host own an episode and only a new episode may announce", async () => {
  const select = jest.fn();
  const { rerender } = await render(
    <ErrorSummary announce={false} errors={errors} onSelectError={select} />,
  );
  expect(screen.getAllByRole("button")).toHaveLength(2);
  await rerender(<ErrorSummary errors={errors} onSelectError={select} />);
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
  await rerender(<ErrorSummary errors={[]} onSelectError={select} />);
  await rerender(<ErrorSummary errors={errors} onSelectError={select} />);
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
  await rerender(<ErrorSummary announce={false} errors={errors} onSelectError={select} />);
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
});

test("StrictMode does not duplicate an episode announcement", async () => {
  await render(
    <StrictMode>
      <ErrorSummary errors={errors} onSelectError={jest.fn()} />
    </StrictMode>,
  );
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
});

test("a submission key remount can announce repeated invalid submissions", async () => {
  const select = jest.fn();
  const { rerender } = await render(
    <ErrorSummary errors={errors} key={1} onSelectError={select} />,
  );
  await rerender(<ErrorSummary errors={errors} key={2} onSelectError={select} />);
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(2);
});

test("custom native view, item and typography props retain header, full text and target sizes", async () => {
  const layout = jest.fn();
  const props: ErrorSummaryProps = {
    errors,
    onSelectError: jest.fn(),
    title: "Check these fields",
    announce: false,
    className: "rounded-xl",
    nativeID: "custom-summary",
    testID: "summary",
    accessibilityHint: "Select a field to continue editing",
    onLayout: layout,
    style: { padding: 24, borderRadius: 20 },
    itemStyle: { paddingVertical: 12, borderRadius: 16, minHeight: 20, minWidth: 24 },
    titleTextProps: {
      variant: "h4",
      style: { fontSize: 23, fontFamily: "CustomTitle" },
      testID: "custom-title",
    },
    itemTextProps: {
      style: { fontSize: 22, lineHeight: 32, fontFamily: "CustomBody" },
      testID: "custom-item-text",
      selectable: true,
    },
  };
  await render(<ErrorSummary {...props} />);
  const summary = screen.getByTestId("summary");
  expect(summary.props.className).toBe("rounded-xl");
  expect(summary.props.nativeID).toBe("custom-summary");
  expect(summary.props.accessibilityHint).toBe("Select a field to continue editing");
  expect(StyleSheet.flatten(summary.props.style)).toMatchObject({
    padding: 24,
    borderRadius: 20,
  });
  await fireEvent(summary, "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width: 320, height: 240 } },
  });
  expect(layout).toHaveBeenCalledTimes(1);
  const title = screen.getByRole("header", { name: "Check these fields" });
  expect(StyleSheet.flatten(title.props.style)).toMatchObject({
    fontSize: 23,
    fontFamily: "CustomTitle",
  });
  expect(title.props.allowFontScaling).toBe(true);
  expect(title.props.numberOfLines).toBe(0);
  for (const button of screen.getAllByRole("button"))
    expect(StyleSheet.flatten(button.props.style)).toMatchObject({
      paddingVertical: 12,
      borderRadius: 16,
      minHeight: 48,
      minWidth: 48,
    });
  const texts = screen.getAllByTestId("custom-item-text");
  expect(texts).toHaveLength(4);
  for (const text of texts) {
    expect(StyleSheet.flatten(text.props.style)).toMatchObject({
      fontSize: 22,
      lineHeight: 32,
      fontFamily: "CustomBody",
    });
    expect(text.props.selectable).toBe(true);
    expect(text.props.allowFontScaling).toBe(true);
    expect(text.props.numberOfLines).toBe(0);
  }
});

test.each([
  { field: "IDs", item: { ...errors[0], id: "" } },
  { field: "IDs", item: { ...errors[0], id: " \n " } },
  { field: "labels", item: { ...errors[0], label: "" } },
  { field: "labels", item: { ...errors[0], label: " \n " } },
  { field: "messages", item: { ...errors[0], message: "" } },
  { field: "messages", item: { ...errors[0], message: " \n " } },
])("rejects blank $field explicitly ($item)", async ({ field, item }) => {
  await expect(
    render(<ErrorSummary errors={[item]} onSelectError={jest.fn()} />),
  ).rejects.toThrow(
    field === "IDs"
      ? "ErrorSummary requires unique, non-empty string keys."
      : `Form.ErrorSummary requires non-empty error ${field}.`,
  );
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
});

test("rejects duplicate IDs explicitly even when labels and messages differ", async () => {
  await expect(
    render(
      <ErrorSummary
        errors={[errors[0], { ...errors[1], id: errors[0].id }]}
        onSelectError={jest.fn()}
      />,
    ),
  ).rejects.toThrow("ErrorSummary requires unique, non-empty string keys.");
  expect(AccessibilityInfo.announceForAccessibility).not.toHaveBeenCalled();
});
