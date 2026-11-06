import { expect, jest, test } from "@jest/globals";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("choosing an action closes the sheet before invoking the action", async () => {
  const calls: string[] = [];
  await render(<ActionSheet actions={[{ label: "Archivar", onPress: () => calls.push("archive") }]} onClose={() => calls.push("close")} title="Opciones" visible />);
  expect(screen.getByRole("header", { name: "Opciones" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Archivar" }));
  expect(calls).toEqual(["close", "archive"]);
});

test("disabled choices cannot activate and cancellation is always available", async () => {
  const choose = jest.fn();
  const close = jest.fn();
  await render(<ActionSheet actions={[{ label: "Archivar", disabled: true, onPress: choose }]} onClose={close} visible />);
  await fireEvent.press(screen.getByRole("button", { name: "Archivar" }));
  expect(choose).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Cancelar" }).props.style).toMatchObject({ minHeight: 48 });
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(close).toHaveBeenCalledTimes(1);
});
