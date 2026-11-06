import { expect, jest, test } from "@jest/globals";
import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import SectionHeader from "@sincpro/mobile-ui/Display/Display.SectionHeader";
import Heading from "@sincpro/mobile-ui/Typography/Typography.Heading";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Dialog/Confirmation.context", () => ({
  useConfirmationContext: () => ({ show: jest.fn(), hide: jest.fn() }),
}));
jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { Icon: () => null },
}));

test("accessible button allows enlarged multiline text without changing legacy sizing", async () => {
  const { rerender } = await render(
    <Button accessibleSizing title="Guardar los cambios del cliente" />,
  );
  const text = screen.getByText("Guardar los cambios del cliente");
  expect(text.props.allowFontScaling).toBe(true);
  expect(text.props.numberOfLines).toBeUndefined();
  expect(screen.getByRole("button").props.style.minHeight).toBe(48);
  await rerender(<Button title="Guardar" />);
  expect(screen.getByText("Guardar").props.allowFontScaling).toBe(false);
  expect(screen.getByText("Guardar").props.numberOfLines).toBe(1);
});

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
      accessibleSizing
      icon="more-horizontal"
      onPress={onPress}
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

test("compound icon action supports the same accessible sizing and busy state", async () => {
  await render(
    <Button.Icon
      accessibilityLabel="Copiar referencia"
      accessibleSizing
      icon="copy"
      loading
    />,
  );
  const action = screen.getByRole("button", { name: "Copiar referencia" });
  expect(action.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  expect(action.props.accessibilityState).toEqual({ disabled: true, busy: true });
});
