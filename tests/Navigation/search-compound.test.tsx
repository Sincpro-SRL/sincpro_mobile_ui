import { expect, jest, test } from "@jest/globals";
import Search from "@sincpro/mobile-ui/Navigation/Navigation.Search";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("composes the existing search history and opens/apply advanced filters", async () => {
  const onApply = jest.fn();
  const onClear = jest.fn();
  await render(
    <Search.Root>
      <Search.History
        items={["Pedido 102"]}
        onRemove={jest.fn()}
        onSelect={jest.fn()}
      />
      <Search.FilterSheet
        activeCount={2}
        onApply={onApply}
        onClear={onClear}
        testID="advanced-filters"
      >
        <Text>Estado del pedido</Text>
      </Search.FilterSheet>
    </Search.Root>,
  );

  expect(screen.getByText("Pedido 102")).toBeTruthy();
  await fireEvent.press(
    screen.getByRole("button", { name: "Filtros, 2 activos" }),
  );
  expect(screen.getByText("Estado del pedido")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar" }));
  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onClear).not.toHaveBeenCalled();
});
