import { expect, jest, test } from "@jest/globals";
import ConfirmationDialog from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("confirmation defaults name the destructive and safe actions explicitly", async () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  await render(<ConfirmationDialog onCancel={onCancel} onConfirm={onConfirm} visible />);

  await fireEvent.press(screen.getByRole("button", { name: "Descartar cambios" }));
  await fireEvent.press(screen.getByRole("button", { name: "Seguir editando" }));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test("confirmation keeps explicitly supplied action labels", async () => {
  await render(
    <ConfirmationDialog
      cancelButtonText="Volver"
      confirmButtonText="Guardar"
      onCancel={jest.fn()}
      onConfirm={jest.fn()}
      visible
    />,
  );

  expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Volver" })).toBeTruthy();
});

test("sheet offers an opt-in named close action and modal semantics", async () => {
  const onClose = jest.fn();
  await render(
    <Sheet onClose={onClose} showCloseButton title="Filtros" visible>
      <></>
    </Sheet>,
  );

  expect(screen.getByText("Filtros").props.accessibilityRole).toBe("header");
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
