import { expect, jest, test } from "@jest/globals";
import ConfirmationDialog from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    KeyboardStickyView: (props: { children?: ReactNode }) =>
      mockReact.createElement(View, props),
  };
});
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

test("confirmation defaults name the destructive and safe actions explicitly", async () => {
  const onClose = jest.fn<() => void>();
  const onConfirm = jest.fn<() => void>();
  await render(<ConfirmationDialog onClose={onClose} onConfirm={onConfirm} visible />);

  await fireEvent.press(screen.getByRole("button", { name: "Seguir editando" }));
  expect(onConfirm).not.toHaveBeenCalled();
  expect(onClose).toHaveBeenCalledTimes(1);
  await fireEvent.press(screen.getByRole("button", { name: "Descartar cambios" }));
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(2));
  expect(onConfirm).toHaveBeenCalledTimes(1);
});

test("confirmation keeps explicitly supplied action labels", async () => {
  await render(
    <ConfirmationDialog
      cancelText="Volver"
      confirmText="Guardar"
      destructive={false}
      onClose={jest.fn<() => void>()}
      onConfirm={jest.fn<() => void>()}
      visible
    />,
  );

  expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Volver" })).toBeTruthy();
});

test("sheet always offers a named close action, modal semantics and native dismissal guards", async () => {
  const onClose = jest.fn<() => void>();
  const { rerender } = await render(
    <Sheet onClose={onClose} testID="filters" title="Filtros" visible>
      <></>
    </Sheet>,
  );

  expect(screen.getByText("Filtros").props.accessibilityRole).toBe("header");
  expect(screen.getByTestId("filters").props.accessibilityViewIsModal).toBe(true);
  expect(screen.getByRole("button", { name: "Cerrar" }).props.style).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(onClose).toHaveBeenCalledTimes(1);
  await rerender(
    <Sheet dismissible={false} onClose={onClose} testID="filters" title="Filtros" visible>
      <></>
    </Sheet>,
  );
  expect(
    screen.getByRole("button", { name: "Cerrar" }).props.accessibilityState.disabled,
  ).toBe(true);
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(false);
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(onClose).toHaveBeenCalledTimes(1);
});
