import { expect, jest, test } from "@jest/globals";
import SearchBar from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import SearchSuggestions from "@sincpro/mobile-ui/Navigation/Navigation.SearchSuggestions";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("suggestions are host-owned, visible on focus and selected without silently editing the query", async () => {
  const change = jest.fn();
  const select = jest.fn();
  const item = { id: "title", label: "Referencia visual", description: "Buscar este título" };
  await render(
    <SearchBar
      accessibilityLabel="Buscar recursos"
      onChangeText={change}
      suggestions={{ items: [item], onSelect: select }}
      value="visual"
    />,
  );
  expect(
    screen.queryByRole("button", { name: "Referencia visual. Buscar este título" }),
  ).toBeNull();
  await fireEvent(screen.getByLabelText("Buscar recursos"), "focus");
  await fireEvent.press(
    screen.getByRole("button", { name: "Referencia visual. Buscar este título" }),
  );
  expect(select).toHaveBeenCalledWith(item);
  expect(change).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: "Referencia visual. Buscar este título" }),
  ).toBeNull();
});

test("suggestion loading/error/empty states are explicit and retryable", async () => {
  const retry = jest.fn();
  const { rerender } = await render(
    <SearchSuggestions items={[]} loading onSelect={jest.fn()} />,
  );
  expect(screen.getByText("Buscando sugerencias…")).toBeTruthy();
  await rerender(
    <SearchSuggestions
      error="Sin conexión"
      items={[]}
      onRetry={retry}
      onSelect={jest.fn()}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Reintentar sugerencias" }));
  expect(retry).toHaveBeenCalledTimes(1);
  await rerender(
    <SearchSuggestions emptyLabel="Prueba otro título" items={[]} onSelect={jest.fn()} />,
  );
  expect(screen.getByText("Prueba otro título")).toBeTruthy();
});
