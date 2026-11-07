import { expect, jest, test } from "@jest/globals";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@react-native-community/datetimepicker", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("checkbox exposes its label, checked state, and default 48 point target", async () => {
  const onCheck = jest.fn();
  await render(
    <Checkbox isChecked mainText="Recibir avisos" onCheck={onCheck} testID="notifications" />,
  );

  const checkbox = screen.getByRole("checkbox", { name: "Recibir avisos" });
  expect(checkbox.props.accessibilityState).toEqual({ checked: true, disabled: false });
  expect(checkbox.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(checkbox);
  expect(onCheck).toHaveBeenCalledWith(false);
});

test("select announces the selected value and its expanded state", async () => {
  const onChange = jest.fn();
  await render(
    <Select
      label="Estado"
      onChange={onChange}
      options={[
        { label: "Pendiente", value: "pending" },
        { label: "En curso", value: "active" },
      ]}
      value="pending"
    />,
  );

  const trigger = screen.getByRole("button", { name: "Estado: Pendiente" });
  expect(trigger.props.accessibilityState).toEqual({ disabled: false, expanded: false });
  expect(trigger.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(trigger);
  expect(
    screen.getByRole("button", { name: "Estado: Pendiente" }).props.accessibilityState,
  ).toEqual({ disabled: false, expanded: true });
  for (const option of screen.getAllByRole("menuitem")) {
    expect(option.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  }
  await fireEvent.press(screen.getByRole("menuitem", { name: "En curso" }));
  expect(onChange).toHaveBeenCalledWith("active");
});

test("select can be closed by default without selecting and allows long trigger text", async () => {
  const onChange = jest.fn();
  const label = "Correo electrónico del responsable del pedido";
  await render(
    <Select
      label="Canal"
      onChange={onChange}
      options={[{ label, value: "email" }]}
      value="email"
    />,
  );
  expect(screen.getByText(label).props.numberOfLines).toBeUndefined();
  expect(screen.getByText(label).props.allowFontScaling).not.toBe(false);
  await fireEvent.press(screen.getByRole("button", { name: `Canal: ${label}` }));
  const close = screen.getByRole("button", { name: "Cerrar opciones" });
  expect(close.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(close);
  expect(onChange).not.toHaveBeenCalled();
  expect(
    screen.getByRole("button", { name: `Canal: ${label}` }).props.accessibilityState.expanded,
  ).toBe(false);
});

test("input defaults to 48 points and preserves multiline height and custom text styles", async () => {
  const { rerender } = await render(<Input label="Notas" value="" />);
  expect(StyleSheet.flatten(screen.getByLabelText("Notas").props.style).minHeight).toBe(48);
  await rerender(
    <Input
      label="Notas"
      multiline
      numberOfLines={4}
      style={{ fontSize: 20, lineHeight: 28 }}
      value="Primera línea\nSegunda línea"
    />,
  );
  const input = screen.getByLabelText("Notas");
  expect(input.props.multiline).toBe(true);
  expect(input.props.numberOfLines).toBe(4);
  expect(input.props.allowFontScaling).not.toBe(false);
  expect(StyleSheet.flatten(input.props.style)).toMatchObject({
    minHeight: 64,
    fontSize: 20,
    lineHeight: 28,
  });
});

test("date trigger has a 48 point target and a scalable unrestricted value label", async () => {
  const text = "Fecha de entrega prevista para el siguiente día hábil";
  await render(
    <DatePicker label="Entrega" onChange={jest.fn()} placeholder={text} value={null} />,
  );
  const trigger = screen.getByRole("button", { name: "Entrega" });
  expect(trigger.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  expect(trigger.props.style.height).toBeUndefined();
  expect(screen.getByText(text).props.numberOfLines).toBeUndefined();
  expect(screen.getByText(text).props.allowFontScaling).not.toBe(false);
});

test("checkbox labels remain scalable and disabling still prevents changes", async () => {
  const onCheck = jest.fn();
  const mainText = "Recibir avisos sobre todos los cambios de mis pedidos";
  await render(<Checkbox disabled mainText={mainText} onCheck={onCheck} />);
  const label = screen.getByText(mainText);
  expect(label.props.numberOfLines).toBeUndefined();
  expect(label.props.allowFontScaling).not.toBe(false);
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  await fireEvent.press(screen.getByRole("checkbox"));
  expect(onCheck).not.toHaveBeenCalled();
});
