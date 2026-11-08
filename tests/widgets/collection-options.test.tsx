import { expect, jest, test } from "@jest/globals";
import { type CollectionQuery, type CriteriaGroup } from "@sincpro/mobile-ui/utils/criteria";
import CollectionOptions from "@sincpro/mobile-ui/widgets/CollectionOptions";
import FilterBuilder from "@sincpro/mobile-ui/widgets/FilterBuilder";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useState } from "react";

import {
  initialQuery,
  QueryCollection,
  queryFields,
} from "../../.rnstorybook/stories/Collections.Query.stories";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const keyboardView = (props: { children?: React.ReactNode }) =>
    mockReact.createElement(View, props);
  return {
    KeyboardStickyView: keyboardView,
    KeyboardAwareScrollView: keyboardView,
    useReanimatedKeyboardAnimation: () => ({
      height: { get: () => 0 },
      progress: { get: () => 0 },
    }),
  };
});
jest.mock("@sincpro/mobile-ui/Form/Form.KeyboardForm", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return ({ children }: { children: React.ReactNode }) =>
    mockReact.createElement(View, {}, children);
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
      children: React.ReactNode;
      index: number;
      onClose: () => void;
    }) => {
      const props = { ...rest, index, testID: "native-sheet" };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
});

function Builder({ onChange }: { onChange: (value: CriteriaGroup) => void }) {
  const [value, setValue] = useState(initialQuery.filter);
  return (
    <FilterBuilder
      fields={queryFields}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      value={value}
    />
  );
}

test("nested builder preserves group joins and commits only complete conditions", async () => {
  const change = jest.fn<(value: CriteriaGroup) => void>();
  await render(<Builder onChange={change} />);
  await fireEvent.press(screen.getByRole("button", { name: "Añadir grupo" }));
  await fireEvent.press(screen.getByRole("button", { name: "Añadir condición" }));
  await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
  expect(screen.getByText("Completa los valores de la condición.")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Valor"), "visual");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
  expect(change).toHaveBeenLastCalledWith({
    kind: "group",
    join: "all",
    children: [
      {
        kind: "group",
        join: "any",
        children: [
          { kind: "condition", field: "title", operator: "contains", values: ["visual"] },
        ],
      },
    ],
  });
});

test("number editing preserves minus and decimal drafts and emits typed values", async () => {
  const change = jest.fn<(value: CriteriaGroup) => void>();
  await render(<Builder onChange={change} />);
  await fireEvent.press(screen.getByRole("button", { name: "Añadir condición" }));
  await fireEvent.press(screen.getByRole("button", { name: "Campo: Título" }));
  await fireEvent.press(screen.getByRole("radio", { name: "Importe" }));
  await fireEvent.changeText(screen.getByLabelText("Valor"), "-");
  expect(screen.getByLabelText("Valor").props.value).toBe("-");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
  expect(screen.getByText("Introduce un número válido.")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Valor"), "-2.50");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
  expect(change).toHaveBeenLastCalledWith({
    ...initialQuery.filter,
    children: [{ kind: "condition", field: "amount", operator: "greater", values: [-2.5] }],
  });
});

test("workspace cannot apply an unfinished condition; cancel never applies", async () => {
  const apply = jest.fn<(query: CollectionQuery) => void>();
  const close = jest.fn<() => void>();
  await render(
    <CollectionOptions
      fields={queryFields}
      onApply={apply}
      onClose={close}
      value={initialQuery}
      visible
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Añadir condición" }));
  expect(
    screen.getByRole("button", { name: "Aplicar configuración" }).props.accessibilityState
      .disabled,
  ).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar configuración" }));
  expect(close).toHaveBeenCalledTimes(1);
  expect(apply).not.toHaveBeenCalled();
});

test("externally replaced builder trees provide explicit recovery rather than crashing", async () => {
  const change = jest.fn<(value: CriteriaGroup) => void>();
  const { rerender } = await render(
    <FilterBuilder
      fields={queryFields}
      onChange={change}
      value={{
        ...initialQuery.filter,
        children: [{ kind: "group", join: "any", children: [] }],
      }}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Abrir grupo 1" }));
  await rerender(
    <FilterBuilder fields={queryFields} onChange={change} value={initialQuery.filter} />,
  );
  expect(
    screen.getByText("Este grupo ya no está disponible. La configuración cambió."),
  ).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Volver a condiciones" }));
  expect(screen.getByRole("header", { name: "Condiciones" })).toBeTruthy();
});

test("saved configurations load into draft and apply all dimensions together", async () => {
  await render(<QueryCollection />);
  await fireEvent.press(screen.getByRole("button", { name: "Filtros, orden y agrupación" }));
  await fireEvent.press(screen.getByRole("tab", { name: "Guardados" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Cargar Pendientes por importe" }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar configuración" }));
  expect(screen.getByText("2 resultados")).toBeTruthy();
  expect(screen.queryByText("Referencia visual")).toBeNull();
  expect(screen.getByText("Agrupación: Región")).toBeTruthy();
  expect(screen.getByText("Orden: Importe desc")).toBeTruthy();
});

test("sorting priorities can be added, flipped and moved without mutating applied state", async () => {
  const apply = jest.fn<(query: CollectionQuery) => void>();
  await render(
    <CollectionOptions
      fields={queryFields}
      onApply={apply}
      onClose={jest.fn<() => void>()}
      sortFields={[
        { id: "title", label: "Título" },
        { id: "amount", label: "Importe" },
      ]}
      value={initialQuery}
      visible
    />,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Ordenar" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Añadir criterio de orden: Seleccionar" }),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Título" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Añadir criterio de orden: Seleccionar" }),
  );
  await fireEvent.press(screen.getByRole("radio", { name: "Importe" }));
  await fireEvent.press(screen.getByRole("button", { name: "Subir Importe" }));
  await fireEvent.press(screen.getByRole("button", { name: "Importe: Ascendente" }));
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar configuración" }));
  expect(apply).toHaveBeenCalledWith({
    ...initialQuery,
    sort: [
      { field: "amount", direction: "desc" },
      { field: "title", direction: "asc" },
    ],
  });
  expect(initialQuery.sort).toEqual([]);
});

test("failed saving stays explicit, retains the name and allows retry", async () => {
  const save = jest
    .fn<(label: string, value: typeof initialQuery) => Promise<void>>()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(undefined);
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  await render(
    <CollectionOptions
      fields={queryFields}
      onApply={jest.fn<(query: CollectionQuery) => void>()}
      onClose={jest.fn<() => void>()}
      onSave={save}
      value={initialQuery}
      visible
    />,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Guardados" }));
  await fireEvent.changeText(screen.getByLabelText("Nombre de la configuración"), "Mi vista");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar configuración" }));
  await waitFor(() =>
    expect(
      screen.getByText("No se pudo guardar. Conservamos la configuración para reintentar."),
    ).toBeTruthy(),
  );
  expect(screen.getByLabelText("Nombre de la configuración").props.value).toBe("Mi vista");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar configuración" }));
  await waitFor(() =>
    expect(
      screen.getByText("Configuración guardada. Pulsa Aplicar configuración para usarla."),
    ).toBeTruthy(),
  );
  expect(save).toHaveBeenCalledTimes(2);
  expect(log).toHaveBeenCalled();
  log.mockRestore();
});
