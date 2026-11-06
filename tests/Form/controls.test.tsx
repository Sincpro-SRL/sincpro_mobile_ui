import { expect, jest, test } from "@jest/globals";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("checkbox exposes its label, checked state, and opt-in target size", async () => {
  const onCheck = jest.fn();
  await render(
    <Checkbox
      accessibleSizing
      isChecked
      mainText="Recibir avisos"
      onCheck={onCheck}
      testID="notifications"
    />,
  );

  const checkbox = screen.getByRole("checkbox", { name: "Recibir avisos" });
  expect(checkbox.props.accessibilityState).toEqual({ checked: true, disabled: false });
  expect(checkbox.props.style).toMatchObject({ minHeight: 48 });
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
  await fireEvent.press(trigger);
  expect(
    screen.getByRole("button", { name: "Estado: Pendiente" }).props.accessibilityState,
  ).toEqual({ disabled: false, expanded: true });
  await fireEvent.press(screen.getByRole("menuitem", { name: "En curso" }));
  expect(onChange).toHaveBeenCalledWith("active");
});

test("accessible select can be closed without selecting and allows long trigger text", async () => {
  const onChange = jest.fn();
  await render(<Select accessibleSizing label="Canal" onChange={onChange} options={[{ label: "Correo", value: "email" }]} value="email" />);
  expect(screen.getByText("Correo").props.numberOfLines).toBeUndefined();
  await fireEvent.press(screen.getByRole("button", { name: "Canal: Correo" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar opciones" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Canal: Correo" }).props.accessibilityState.expanded).toBe(false);
});
