import { expect, jest, test } from "@jest/globals";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
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

test("choosing an action closes the native sheet only after the action succeeds", async () => {
  const calls: string[] = [];
  let release: () => void = () => {};
  const request = new Promise<void>((resolve) => {
    release = resolve;
  });
  await render(
    <ActionSheet
      actions={[
        {
          label: "Archivar",
          onPress: async () => {
            calls.push("archive");
            await request;
          },
        },
      ]}
      onClose={() => {
        calls.push("close");
      }}
      title="Opciones"
      visible
    />,
  );
  expect(screen.getByRole("header", { name: "Opciones" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Archivar" }));
  expect(calls).toEqual(["archive"]);
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(false);
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(calls).toEqual(["archive"]);
  await act(async () => release());
  expect(calls).toEqual(["archive", "close"]);
});

test("disabled choices cannot activate and cancellation is always available", async () => {
  const choose = jest.fn<() => void>();
  const close = jest.fn<() => void>();
  await render(
    <ActionSheet
      actions={[{ label: "Archivar", disabled: true, onPress: choose }]}
      onClose={close}
      visible
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Archivar" }));
  expect(choose).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Cancelar" }).props.style).toMatchObject({
    minHeight: 48,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(close).toHaveBeenCalledTimes(1);
});
