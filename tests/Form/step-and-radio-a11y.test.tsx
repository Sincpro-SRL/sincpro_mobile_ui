import { expect, jest, test } from "@jest/globals";
import QuantitySelector from "@sincpro/mobile-ui/Form/Form.QuantitySelector";
import RadioButton from "@sincpro/mobile-ui/Form/Form.RadioButton";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("quantity steps are named buttons with a 48 point target", async () => {
  const onChange = jest.fn();
  await render(<QuantitySelector max={5} min={1} onChange={onChange} value={1} />);
  const less = screen.getByRole("button", { name: "Disminuir" });
  const more = screen.getByRole("button", { name: "Aumentar" });
  expect(less.props.accessibilityState).toMatchObject({ disabled: true });
  expect(36 + less.props.hitSlop.top + less.props.hitSlop.bottom).toBe(48);
  await fireEvent.press(more);
  expect(onChange).toHaveBeenCalledWith(2);
});

test("a radio announces its role, label and checked state", async () => {
  await render(<RadioButton label="Efectivo" onPress={jest.fn()} selected />);
  const radio = screen.getByRole("radio", { name: "Efectivo" });
  expect(radio.props.accessibilityState).toMatchObject({ checked: true });
});
