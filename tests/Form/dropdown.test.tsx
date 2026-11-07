import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, StyleSheet, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
beforeEach(() => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
});
afterEach(() => {
  jest.restoreAllMocks();
});

test("dropdown has named scalable targets and supports native Back and accessible close", async () => {
  await render(<Dropdown options={[]} title="Opciones" />);
  const trigger = screen.getByRole("button", { name: "Opciones" });
  expect(StyleSheet.flatten(trigger.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(trigger);
  const close = screen.getByRole("button", { name: "Cerrar opciones" });
  expect(StyleSheet.flatten(close.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  const modal = screen.container
    .queryAll((node) => node.props.onRequestClose !== undefined)
    .at(-1);
  if (!modal) throw new Error("Expected a native modal");
  await fireEvent(modal, "requestClose");
  expect(screen.queryByRole("button", { name: "Cerrar opciones" })).toBeNull();
});

test("custom options, header text and native styles keep disabled/selection behavior", async () => {
  const selected = jest.fn();
  const blocked = jest.fn();
  await render(
    <Dropdown
      buttonProps={{ style: { borderRadius: 20 } }}
      contentProps={{ testID: "panel", style: { borderRadius: 30 } }}
      options={[
        { id: "enabled", title: "Disponible", onPress: selected },
        { id: "disabled", title: "Bloqueado", onPress: blocked, disabled: true },
      ]}
      optionProps={{ style: { paddingVertical: 18 } }}
      renderOption={(option) => <Text>{`Diseño ${option.title}`}</Text>}
      title="Elegir"
      titleTextProps={{ style: { fontSize: 24 } }}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Elegir" }));
  expect(StyleSheet.flatten(screen.getByTestId("panel").props.style).borderRadius).toBe(30);
  expect(
    StyleSheet.flatten(screen.getByRole("header", { name: "Elegir" }).props.style).fontSize,
  ).toBe(24);
  expect(screen.getByText("Diseño Disponible")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Bloqueado" }));
  expect(blocked).not.toHaveBeenCalled();
  const option = screen.getByRole("button", { name: "Disponible" });
  expect(StyleSheet.flatten(option.props.style)).toMatchObject({
    minHeight: 48,
    paddingVertical: 18,
  });
  await fireEvent.press(option);
  expect(selected).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Disponible" })).toBeNull();
});
