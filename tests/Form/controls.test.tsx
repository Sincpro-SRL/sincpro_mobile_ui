import type { PickerItemProps, PickerProps } from "@expo/ui";
import type { DateTimePickerProps } from "@expo/ui/community/datetime-picker";
import { expect, jest, test } from "@jest/globals";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const keyboardView = (props: { children?: ReactNode }) =>
    mockReact.createElement(View, props);
  return { KeyboardStickyView: keyboardView, KeyboardAwareScrollView: keyboardView };
});
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({ children, index, ...rest }: { children: ReactNode; index: number }) => {
      const props = { ...rest, index, testID: "native-sheet" };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
});
jest.mock("@expo/ui", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  const picker = ({ children, ...rest }: PickerProps<string>) => {
    const props = { ...rest, testID: rest.testID ?? "native-picker" };
    return mockReact.createElement(View, props, children);
  };
  return {
    Host: (props: { children: ReactNode }) => mockReact.createElement(View, props),
    Picker: Object.assign(picker, {
      Item: ({ label }: PickerItemProps<string>) => mockReact.createElement(Text, {}, label),
    }),
  };
});
jest.mock("@expo/ui/community/datetime-picker", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: (props: DateTimePickerProps) => mockReact.createElement(View, props),
  };
});

test("checkbox exposes its label, checked state, and default 48 point target", async () => {
  const onCheck = jest.fn<(checked: boolean) => void>();
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
  const onChange = jest.fn<(value: string) => void>();
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
  expect(trigger.props.accessibilityState).toEqual({
    disabled: false,
    expanded: false,
    busy: false,
  });
  expect(trigger.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(trigger);
  expect(
    screen.getByRole("button", { name: "Estado: Pendiente" }).props.accessibilityState,
  ).toEqual({ disabled: false, expanded: true, busy: false });
  expect(
    screen.getByRole("radio", { name: "Pendiente" }).props.accessibilityState,
  ).toMatchObject({ checked: true, selected: true });
  await fireEvent.press(screen.getByRole("radio", { name: "En curso" }));
  await waitFor(() => expect(onChange).toHaveBeenCalledWith("active"));
  expect(onChange).toHaveBeenCalledWith("active");
});

test("select can be closed by default without selecting and allows long trigger text", async () => {
  const onChange = jest.fn<(value: string) => void>();
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
  const close = screen.getByRole("button", { name: "Cerrar" });
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
    <DatePicker
      label="Entrega"
      onChange={jest.fn<(value: Date) => void>()}
      placeholder={text}
      value={null}
    />,
  );
  const trigger = screen.getByRole("button", { name: "Entrega" });
  expect(trigger.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  expect(trigger.props.style.height).toBeUndefined();
  expect(screen.getByText(text).props.numberOfLines).toBeUndefined();
  expect(screen.getByText(text).props.allowFontScaling).not.toBe(false);
});

test("checkbox labels remain scalable and disabling still prevents changes", async () => {
  const onCheck = jest.fn<(checked: boolean) => void>();
  const mainText = "Recibir avisos sobre todos los cambios de mis pedidos";
  await render(<Checkbox disabled mainText={mainText} onCheck={onCheck} />);
  const label = screen.getByText(mainText);
  expect(label.props.numberOfLines).toBeUndefined();
  expect(label.props.allowFontScaling).not.toBe(false);
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  await fireEvent.press(screen.getByRole("checkbox"));
  expect(onCheck).not.toHaveBeenCalled();
});
