import { expect, jest, test } from "@jest/globals";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import { getActiveTheme } from "@sincpro/mobile-ui/theme";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      ...rest
    }: {
      children: ReactNode;
      index: number;
      onClose: () => void;
    }) => {
      const props = { ...rest, index, testID: "native-sheet" };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
});

test("dropdown has named scalable targets and supports native Back and accessible close", async () => {
  await render(<Dropdown options={[]} title="Opciones" />);
  const trigger = screen.getByRole("button", { name: "Opciones" });
  expect(StyleSheet.flatten(trigger.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(trigger);
  const close = screen.getByRole("button", { name: "Cerrar" });
  expect(StyleSheet.flatten(close.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(close);
  expect(screen.queryByRole("button", { name: "Cerrar" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Opciones" }));
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(true);
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(screen.queryByRole("button", { name: "Cerrar" })).toBeNull();
});

test("custom options and trigger styles retain scalable themed headers and disabled selection behavior", async () => {
  const selected = jest.fn<() => void>();
  const blocked = jest.fn<() => void>();
  await render(
    <Dropdown
      buttonProps={{ style: { borderRadius: 20 } }}
      options={[
        { id: "enabled", title: "Disponible", onPress: selected },
        { id: "disabled", title: "Bloqueado", onPress: blocked, disabled: true },
      ]}
      renderOption={(option) => <Text>{`Diseño ${option.title}`}</Text>}
      size="large"
      title="Elegir"
    />,
  );
  expect(
    StyleSheet.flatten(screen.getByRole("button", { name: "Elegir" }).props.style),
  ).toMatchObject({
    borderRadius: 20,
    minHeight: 48,
    paddingVertical: 12,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Elegir" }));
  expect(screen.getByTestId("native-sheet").props.backgroundStyle).toEqual({
    backgroundColor: getActiveTheme().bg.card,
  });
  expect(screen.getByRole("header", { name: "Elegir" }).props.allowFontScaling).not.toBe(
    false,
  );
  expect(screen.getByRole("header", { name: "Elegir" }).props.numberOfLines).toBeUndefined();
  expect(screen.getByText("Diseño Disponible")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Bloqueado" }));
  expect(blocked).not.toHaveBeenCalled();
  const option = screen.getByRole("button", { name: "Disponible" });
  expect(StyleSheet.flatten(option.props.style)).toMatchObject({
    minHeight: 48,
    minWidth: 48,
  });
  await fireEvent.press(option);
  await waitFor(() => expect(selected).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole("button", { name: "Disponible" })).toBeNull();
});
