import { afterEach, expect, jest, test } from "@jest/globals";
import { FilterButton } from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
import SearchBar from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import { FilterBar } from "@sincpro/mobile-ui/widgets/FilterBar";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as ReactNative from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 844, scale: 3, fontScale: 1 })),
}));
afterEach(() => {
  jest.restoreAllMocks();
});

test("search exposes a named readable input and a separate 48 point clear action", async () => {
  const change = jest.fn();
  const clear = jest.fn();
  await render(
    <SearchBar
      accessibilityLabel="Buscar recursos"
      clearAccessibilityLabel="Limpiar búsqueda"
      onChangeText={change}
      onClear={clear}
      value="Guía"
    />,
  );
  const input = screen.getByDisplayValue("Guía");
  expect(input.props.accessibilityLabel).toBe("Buscar recursos");
  expect(ReactNative.StyleSheet.flatten(input.props.style)).toMatchObject({
    fontSize: 17,
    minHeight: 48,
  });
  const action = screen.getByRole("button", { name: "Limpiar búsqueda" });
  expect(ReactNative.StyleSheet.flatten(action.props.style)).toMatchObject({
    minHeight: 48,
    minWidth: 48,
  });
  await fireEvent.press(action);
  expect(change).toHaveBeenCalledWith("");
  expect(clear).toHaveBeenCalledTimes(1);
});

test("search forwards typing and submission without inventing result state", async () => {
  const change = jest.fn();
  const submit = jest.fn();
  await render(<SearchBar onChangeText={change} onSubmit={submit} value="" />);
  await fireEvent.changeText(screen.getByLabelText("Buscar"), "referencia");
  await fireEvent(screen.getByLabelText("Buscar"), "submitEditing", {
    nativeEvent: { text: "referencia" },
  });
  expect(change).toHaveBeenCalledWith("referencia");
  expect(submit).toHaveBeenCalledWith("referencia");
});

test("search triggers default to readable scalable multiline labels", async () => {
  const press = jest.fn();
  await render(
    <SearchBar
      accessibilityLabel="Abrir búsqueda"
      editable={false}
      onChangeText={jest.fn()}
      onPress={press}
      placeholder="Buscar recursos por título"
      value=""
    />,
  );
  const text = screen.getByText("Buscar recursos por título");
  expect(text.props.numberOfLines).toBeUndefined();
  expect(text.props.allowFontScaling).not.toBe(false);
  expect(ReactNative.StyleSheet.flatten(text.props.style).fontSize).toBe(17);
  const trigger = screen.getByRole("search", { name: "Abrir búsqueda" });
  expect(trigger.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(trigger);
  expect(press).toHaveBeenCalledTimes(1);
});

test("mobile filters expose selection and disabled state without truncating labels", async () => {
  const press = jest.fn();
  const { rerender } = await render(
    <FilterButton active onPress={press} title="Pendientes de revisión" variant="mobile" />,
  );
  expect(screen.getByRole("button").props.accessibilityState.selected).toBe(true);
  expect(screen.getByText("Pendientes de revisión").props.numberOfLines).toBeUndefined();
  expect(
    ReactNative.StyleSheet.flatten(screen.getByRole("button").props.style),
  ).toMatchObject({ minHeight: 48, minWidth: 48 });
  await rerender(
    <FilterButton
      active
      disabled
      onPress={press}
      title="Pendientes de revisión"
      variant="mobile"
    />,
  );
  await fireEvent.press(screen.getByRole("button"));
  expect(press).not.toHaveBeenCalled();
});

test("the controlled bar forwards IDs and only offers clearing when filters are active", async () => {
  const filter = jest.fn();
  const clear = jest.fn();
  const { rerender } = await render(
    <FilterBar
      filters={[{ id: "pending", label: "Pendientes", selected: false }]}
      onClearFilters={clear}
      onFilterPress={filter}
      resultsLabel="3 resultados"
    />,
  );
  expect(screen.queryByRole("button", { name: "Limpiar filtros" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Pendientes" }));
  expect(filter).toHaveBeenCalledWith("pending");
  await rerender(
    <FilterBar
      filters={[{ id: "pending", label: "Pendientes", selected: true }]}
      onClearFilters={clear}
      onFilterPress={filter}
      resultsLabel="2 resultados"
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Limpiar filtros" }));
  expect(clear).toHaveBeenCalledTimes(1);
  expect(screen.getByText("2 resultados").props.accessibilityLiveRegion).toBe("polite");
});

test.each([
  [1.3, "scroll"],
  [1.31, "wrap"],
] as const)("auto layout at font scale %s selects %s", async (fontScale, expected) => {
  jest
    .mocked(ReactNative.useWindowDimensions)
    .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale });
  await render(<FilterBar filters={[]} onFilterPress={jest.fn()} testID="filters" />);
  expect(screen.getByTestId("filters-options").props.horizontal ?? false).toBe(
    expected === "scroll",
  );
});

test("hosts can explicitly choose layout and supply a separate advanced-filter action", async () => {
  const more = jest.fn();
  jest
    .mocked(ReactNative.useWindowDimensions)
    .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 2 });
  await render(
    <FilterBar
      filters={[]}
      filtersLabel="Abrir filtros"
      layout="scroll"
      onFilterPress={jest.fn()}
      onOpenFilters={more}
      testID="filters"
    />,
  );
  expect(screen.getByTestId("filters-options").props.horizontal).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Abrir filtros" }));
  expect(more).toHaveBeenCalledTimes(1);
});
