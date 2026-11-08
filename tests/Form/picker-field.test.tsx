import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import PickerField, { type PickerOption } from "@sincpro/mobile-ui/Form/Form.PickerField";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

const CUSTOMERS: PickerOption<number>[] = [
  { value: 1, label: "José Páez Núñez", description: "Cochabamba" },
  { value: 2, label: "Ana Rojas", description: "La Paz" },
  { value: 3, label: "Comercial Núñez", description: "Santa Cruz" },
];
const hidden = { includeHiddenElements: true };

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

test("local options are filtered without accents and choosing one closes the sheet", async () => {
  const change = jest.fn();
  await render(
    <PickerField
      label="Cliente"
      onChange={change}
      options={CUSTOMERS}
      testID="customer"
      value={null}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cliente: Seleccionar" }));
  await fireEvent.changeText(screen.getByTestId("customer-search", hidden), "nunez");
  expect(screen.getByText("José Páez Núñez", hidden)).toBeTruthy();
  expect(screen.getByText("Comercial Núñez", hidden)).toBeTruthy();
  expect(screen.queryByText("Ana Rojas", hidden)).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Comercial Núñez", ...hidden }));
  expect(change).toHaveBeenCalledWith(3, CUSTOMERS[2]);
});

test("remote search is debounced and a stale answer never replaces a newer one", async () => {
  const resolvers: ((value: PickerOption<number>[]) => void)[] = [];
  const search = jest.fn(
    (_query: string) =>
      new Promise<PickerOption<number>[]>((resolve) => resolvers.push(resolve)),
  );
  await render(
    <PickerField
      label="Cliente"
      onChange={jest.fn()}
      search={search}
      testID="remote"
      value={null}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cliente: Seleccionar" }));
  await fireEvent.changeText(screen.getByTestId("remote-search", hidden), "ro");
  await fireEvent.changeText(screen.getByTestId("remote-search", hidden), "roj");
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(search).toHaveBeenCalledTimes(1);
  expect(search).toHaveBeenLastCalledWith("roj");
  await fireEvent.changeText(screen.getByTestId("remote-search", hidden), "rojas");
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  await act(async () => {
    resolvers[1]([CUSTOMERS[1]]);
    resolvers[0]([CUSTOMERS[0]]);
  });
  expect(screen.getByText("Ana Rojas", hidden)).toBeTruthy();
  expect(screen.queryByText("José Páez Núñez", hidden)).toBeNull();
});

test("a failed remote search is shown instead of an empty list", async () => {
  const search = jest.fn((_query: string) =>
    Promise.reject<PickerOption<number>[]>(new Error("Sin conexión con Odoo")),
  );
  await render(
    <PickerField
      label="Producto"
      onChange={jest.fn()}
      search={search}
      testID="failing"
      value={null}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Producto: Seleccionar" }));
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByText("Sin conexión con Odoo", hidden)).toBeTruthy();
});

test("a selected value outside the current results keeps its label", async () => {
  await render(
    <PickerField
      label="Cliente"
      onChange={jest.fn()}
      search={async () => []}
      selectedLabel="Ana Rojas"
      value={2}
    />,
  );
  expect(screen.getByRole("button", { name: "Cliente: Ana Rojas" })).toBeTruthy();
});
