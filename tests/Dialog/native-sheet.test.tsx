import type { BottomSheetProps } from "@expo/ui/community/bottom-sheet";
import { expect, jest, test } from "@jest/globals";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      onClose,
      snapPoints,
      enablePanDownToClose,
      backgroundStyle,
    }: BottomSheetProps) => {
      const props = {
        testID: "native-sheet",
        index,
        onClose,
        snapPoints,
        enablePanDownToClose,
        backgroundStyle,
      };
      return mockReact.createElement(View, props, index === -1 ? null : children);
    },
    BottomSheetView: View,
  };
});

test("canonical sheet controls native presentation and provides a named close action", async () => {
  const close = jest.fn();
  const { rerender } = await render(
    <Sheet onClose={close} title="Resumen" visible>
      <Text>Contenido</Text>
    </Sheet>,
  );
  expect(screen.getByTestId("native-sheet").props.index).toBe(0);
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["60%", "90%"]);
  expect(screen.getByRole("header", { name: "Resumen" })).toBeTruthy();
  const action = screen.getByRole("button", { name: "Cerrar" });
  expect(action.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  await fireEvent.press(action);
  expect(close).toHaveBeenCalledTimes(1);
  await rerender(
    <Sheet onClose={close} title="Resumen" visible={false}>
      <Text>Contenido</Text>
    </Sheet>,
  );
  expect(screen.queryByTestId("native-sheet")).toBeNull();
  expect(close).toHaveBeenCalledTimes(1);
});

test("non-dismissible sheets disable native dismissal and accessible Close", async () => {
  const close = jest.fn();
  await render(
    <Sheet dismissible={false} onClose={close} title="Guardando" visible>
      <Text>Contenido</Text>
    </Sheet>,
  );
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(false);
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(close).not.toHaveBeenCalled();
});

test("list sheets have no outer ScrollView and keep an independent footer", async () => {
  await render(
    <Sheet
      footer={<Text>Aplicar</Text>}
      onClose={jest.fn()}
      scrollable={false}
      snapPoints={["90%"]}
      title="Opciones"
      visible
    >
      <Text>Lista</Text>
    </Sheet>,
  );
  expect(
    screen
      .getByTestId("native-sheet")
      .queryAll((node) => node.props.keyboardShouldPersistTaps === "handled"),
  ).toHaveLength(0);
  expect(screen.getByText("Aplicar")).toBeTruthy();
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["90%"]);
});
