import { expect, jest, test } from "@jest/globals";
import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import FAB from "@sincpro/mobile-ui/Actions/Actions.FAB";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import SectionHeader from "@sincpro/mobile-ui/Display/Display.SectionHeader";
import Heading from "@sincpro/mobile-ui/Typography/Typography.Heading";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Dialog/Confirmation.context", () => ({
  useConfirmationContext: () => ({ show: jest.fn(), hide: jest.fn() }),
}));
jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { Icon: () => null },
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test.each(["primary", "secondary", "link"] as const)(
  "%s buttons allow scaled multiline labels and a 48 point target by default",
  async (variant) => {
    await render(
      <Button size="small" title="Guardar los cambios del cliente" variant={variant} />,
    );
    const text = screen.getByText("Guardar los cambios del cliente");
    expect(text.props.allowFontScaling).toBe(true);
    expect(text.props.numberOfLines).toBeUndefined();
    expect(StyleSheet.flatten(text.props.style).flexShrink).toBe(1);
    expect(screen.getByRole("button").props.style).toMatchObject({
      minWidth: 48,
      minHeight: 48,
    });
    expect(screen.getByRole("button").props.style.height).toBeUndefined();
  },
);

test("loading button announces busy and cannot activate its action", async () => {
  const onPress = jest.fn();
  await render(<Button loading onPress={onPress} title="Guardar" />);
  expect(screen.getByRole("button", { name: "Guardar" }).props.accessibilityState).toEqual({
    disabled: true,
    busy: true,
  });
  await fireEvent.press(screen.getByRole("button"));
  expect(onPress).not.toHaveBeenCalled();
});

test("icon action exposes a supplied name and a 48 point target", async () => {
  const onPress = jest.fn();
  await render(
    <IconButton
      accessibilityLabel="Más opciones"
      icon="more"
      onPress={onPress}
      size="small"
    />,
  );
  const button = screen.getByRole("button", { name: "Más opciones" });
  expect(button.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  await fireEvent.press(button);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("section and screen titles expose header semantics", async () => {
  await render(
    <>
      <Heading>Detalle</Heading>
      <SectionHeader title="Información" />
    </>,
  );
  expect(screen.getAllByRole("header")).toHaveLength(2);
});

test("compound icon action defaults to the same target and busy state", async () => {
  await render(<Button.Icon accessibilityLabel="Copiar referencia" icon="copy" loading />);
  const action = screen.getByRole("button", { name: "Copiar referencia" });
  expect(action.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  expect(action.props.accessibilityState).toEqual({ disabled: true, busy: true });
});

test.each([undefined, "Crear un registro con todos los datos del cliente"])(
  "FAB keeps its 56 point target and lets extended labels grow: %s",
  async (label) => {
    await render(<FAB icon="add" label={label} onPress={jest.fn()} />);
    const action = screen.getByRole("button");
    expect(action.props.style).toMatchObject({ minHeight: 56, minWidth: 56 });
    if (label) {
      const text = screen.getByText(label);
      expect(text.props.allowFontScaling).not.toBe(false);
      expect(text.props.numberOfLines).toBeUndefined();
      expect(StyleSheet.flatten(text.props.style).flexShrink).toBe(1);
      expect(action.props.style.height).toBeUndefined();
    }
  },
);
