import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { CollectionRecipe } from "../../.rnstorybook/stories/Composition.stories";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Dialog/Confirmation.context", () => ({
  useConfirmationContext: () => ({ show: jest.fn(), hide: jest.fn() }),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
test("search and quick filters refine real results and reset recovers from empty", async () => {
  await render(<CollectionRecipe />);
  await fireEvent.press(screen.getByRole("button", { name: "Pendientes" }));
  expect(screen.getByText("2 resultados")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Buscar recursos"), "Referencia");
  expect(screen.getByText("Sin resultados")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Restablecer búsqueda" }));
  expect(screen.getByText("3 resultados")).toBeTruthy();
  expect(screen.getByLabelText("Buscar recursos").props.value).toBe("");
});

test.each([false, true])(
  "saving is independent from opening a resource in cards=%s",
  async (cards) => {
    await render(<CollectionRecipe cards={cards} />);
    await fireEvent.press(screen.getByRole("button", { name: "Guardar Guía de inicio" }));
    expect(screen.queryByText("Guardar en mi selección")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Guardados" }));
    expect(screen.getByText("1 resultado")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Abrir Referencia visual" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Abrir Guía de inicio" }));
    expect(screen.getByText("Quitar de mi selección")).toBeTruthy();
  },
);

test("advanced filter changes are drafts until Apply and stay visible as an active chip", async () => {
  await render(<CollectionRecipe />);
  await fireEvent.press(screen.getByRole("button", { name: "Más filtros" }));
  await fireEvent.press(screen.getByRole("checkbox", { name: "Solo destacados" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.getByText("3 resultados")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Destacados" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Más filtros" }));
  expect(
    screen.getByRole("checkbox", { name: "Solo destacados" }).props.accessibilityState
      .checked,
  ).toBe(false);
  await fireEvent.press(screen.getByRole("checkbox", { name: "Solo destacados" }));
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar filtros" }));
  expect(screen.getByText("1 resultado")).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Destacados" }).props.accessibilityState.selected,
  ).toBe(true);
});
