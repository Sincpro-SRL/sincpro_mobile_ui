import { expect, jest, test } from "@jest/globals";
import NativeSheet from "@sincpro/mobile-ui/Dialog/Dialog.NativeSheet";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, index, onClose, snapPoints }: { children: React.ReactNode; index: number; onClose: () => void; snapPoints: string[] }) =>
      mockReact.createElement(View, { testID: "native-host", index, onClose, snapPoints }, children),
    BottomSheetView: View,
  };
});

test("native sheet controls presentation and provides a named close action", async () => {
  const close = jest.fn();
  const { rerender } = await render(<NativeSheet onClose={close} title="Resumen" visible><Text>Contenido</Text></NativeSheet>);
  expect(screen.getByTestId("native-host").props.index).toBe(0);
  expect(screen.getByTestId("native-host").props.snapPoints).toEqual(["60%", "90%"]);
  expect(screen.getByRole("header", { name: "Resumen" })).toBeTruthy();
  const action = screen.getByRole("button", { name: "Cerrar" });
  expect(action.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  await fireEvent.press(action);
  expect(close).toHaveBeenCalledTimes(1);
  await rerender(<NativeSheet onClose={close} title="Resumen" visible={false}><Text>Contenido</Text></NativeSheet>);
  expect(screen.getByTestId("native-host").props.index).toBe(-1);
  await fireEvent(screen.getByTestId("native-host"), "onClose");
  expect(close).toHaveBeenCalledTimes(1);
});
