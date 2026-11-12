import { afterEach, expect, jest, test } from "@jest/globals";
import {
  type BarRendererProps,
  CHART_SERIES_DARK,
  CHART_SERIES_LIGHT,
  Charts,
  registerChartRenderers,
  resetChartRenderers,
} from "@sincpro/mobile-ui/Charts";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

type MockChildren = { children?: ReactNode };

jest.mock("react-native-svg", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Text: NativeText, View: NativeView } =
    jest.requireActual<typeof import("react-native")>("react-native");
  const mark = (name: string) => (props: object) =>
    React.createElement(NativeView, { ...props, testID: `svg-${name}` });
  return {
    __esModule: true,
    default: ({ children }: MockChildren) =>
      React.createElement(NativeView, { testID: "svg" }, children),
    G: ({ children }: MockChildren) => React.createElement(NativeView, null, children),
    Path: mark("path"),
    Line: mark("line"),
    Circle: mark("circle"),
    Text: ({ children }: MockChildren) => React.createElement(NativeText, null, children),
  };
});

const months = (values: (number | null)[]) =>
  ["Ene", "Feb", "Mar"].map((key, index) => ({ key, value: values[index] ?? null }));

async function measure(testID: string, width = 320) {
  await fireEvent(screen.getByTestId(`${testID}-plot`), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 200 } },
  });
}

async function step(testID: string, actionName: "increment" | "decrement") {
  await fireEvent(screen.getByTestId(`${testID}-plot`), "accessibilityAction", {
    nativeEvent: { actionName },
  });
}

/** The readout and legend repeat the plot's accessible text, so they are hidden from it. */
const hidden = { includeHiddenElements: true };

afterEach(async () => {
  resetChartRenderers();
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("a bar chart reads its latest value, describes every value and steps through them", async () => {
  const onSelect = jest.fn();
  await render(
    <Charts.Bar
      formatValue={(value) => `Bs ${value}`}
      label="Ventas por mes"
      onSelect={onSelect}
      series={[{ name: "Ventas", data: months([1200, 1500, 900]) }]}
      testID="sales"
    />,
  );
  await measure("sales");

  const plot = screen.getByTestId("sales-plot");
  expect(plot.props.accessibilityRole).toBe("adjustable");
  expect(plot.props.accessibilityLabel).toBe(
    "Ventas por mes. Ventas: Ene Bs 1200, Feb Bs 1500, Mar Bs 900",
  );
  expect(plot.props.accessibilityValue).toEqual({ text: "Mar: Ventas Bs 900" });
  expect(screen.getAllByTestId("svg-path")).toHaveLength(3);
  expect(screen.queryByText("Ventas", hidden)).toBeNull();

  await step("sales", "increment");
  expect(onSelect).toHaveBeenLastCalledWith("Ene");
  expect(screen.getByTestId("sales-plot").props.accessibilityValue).toEqual({
    text: "Ene: Ventas Bs 1200",
  });
  expect(screen.getByText("Bs 1200", hidden)).toBeTruthy();

  await step("sales", "increment");
  await step("sales", "decrement");
  expect(onSelect).toHaveBeenLastCalledWith("Ene");
  expect(onSelect).toHaveBeenCalledTimes(3);
});

test("two series get a legend, a readout row each and their palette colors", async () => {
  await render(
    <Charts.Line
      label="Cobros"
      series={[
        { name: "Este mes", data: months([5, 7, 9]) },
        { name: "Mes anterior", data: months([4, null, 6]) },
      ]}
      testID="collections"
    />,
  );
  await measure("collections");

  // The readout and the legend both name each series; screen readers hear the summary.
  expect(screen.getAllByText("Este mes", hidden)).toHaveLength(2);
  expect(screen.getAllByText("Mes anterior", hidden)).toHaveLength(2);
  expect(screen.getByTestId("collections-plot").props.accessibilityValue).toEqual({
    text: "Mar: Este mes 9, Mes anterior 6",
  });
  const strokes = screen.getAllByTestId("svg-path").map((path) => path.props.stroke);
  expect(strokes).toEqual([CHART_SERIES_LIGHT[0], CHART_SERIES_LIGHT[1]]);
});

test("a dark theme switches the palette to its dark steps", async () => {
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  await render(
    <Charts.Bar label="Ventas" series={[{ name: "Ventas", data: months([1, 2, 3]) }]} testID="dark" />,
  );
  await measure("dark");
  expect(screen.getAllByTestId("svg-path")[0].props.fill).toBe(CHART_SERIES_DARK[0]);
});

test("without values the chart says so, and while loading without values it waits", async () => {
  const { rerender } = await render(
    <Charts.Bar
      label="Ventas"
      series={[{ name: "Ventas", data: months([null, null, null]) }]}
      testID="none"
    />,
  );
  expect(screen.getByText("Sin datos para mostrar")).toBeTruthy();
  expect(screen.getByTestId("none").props.accessibilityLabel).toBe(
    "Ventas. Sin datos para mostrar",
  );
  expect(screen.queryByTestId("none-plot")).toBeNull();

  await rerender(<Charts.Bar label="Ventas" loading series={[]} testID="none" />);
  expect(screen.queryByText("Sin datos para mostrar")).toBeNull();
  expect(screen.getByLabelText("Ventas. Cargando")).toBeTruthy();
});

test("refreshing keeps the previous chart, dimmed and marked busy", async () => {
  await render(
    <Charts.Line
      label="Cobros"
      loading
      series={[{ name: "Cobros", data: months([1, 2, 3]) }]}
      testID="busy"
    />,
  );
  const plot = screen.getByTestId("busy-plot");
  expect(plot.props.accessibilityState).toEqual({ busy: true });
  expect(plot.props.style).toEqual(expect.objectContaining({ opacity: 0.5 }));
});

test("a donut shows its total, lists every part with its share and selects from the legend", async () => {
  const onSelect = jest.fn();
  await render(
    <Charts.Donut
      data={[
        { key: "Tienda", value: 50 },
        { key: "Ruta", value: 30 },
        { key: "Web", value: 15 },
        { key: "Teléfono", value: 5 },
      ]}
      label="Ventas por canal"
      maxSlices={3}
      onSelect={onSelect}
      testID="channels"
    />,
  );
  await measure("channels");

  expect(screen.getByText("Total")).toBeTruthy();
  expect(screen.getByText("100")).toBeTruthy();
  expect(screen.getByLabelText(/^Otros: 20, 20\s?%$/)).toBeTruthy();
  expect(screen.getAllByTestId("svg-path")).toHaveLength(3);

  await fireEvent.press(screen.getByLabelText(/^Ruta: 30, 30\s?%$/));
  expect(onSelect).toHaveBeenLastCalledWith("Ruta");
  // The hole names the part and its share, next to the same row of the table.
  expect(screen.getAllByText("Ruta")).toHaveLength(2);
  expect(screen.getAllByText(/^30\s?%$/)).toHaveLength(2);
  expect(screen.getByTestId("channels-plot").props.accessibilityValue.text).toMatch(
    /^Ruta: 30, 30\s?%$/,
  );

  await fireEvent.press(screen.getByLabelText(/^Ruta: 30, 30\s?%$/));
  expect(onSelect).toHaveBeenLastCalledWith(null);
  expect(screen.getByText("Total")).toBeTruthy();
});

test("an app replaces a renderer, and null or reset restores the built-in one", async () => {
  const seen: BarRendererProps[] = [];
  function CustomBars(props: BarRendererProps) {
    seen.push(props);
    return (
      <View testID="custom-bars">
        <Text>{props.bars.length} barras</Text>
      </View>
    );
  }
  const series = [{ name: "Ventas", data: months([1, 2, 3]) }];

  registerChartRenderers({ bar: CustomBars });
  const { rerender } = await render(<Charts.Bar label="Ventas" series={series} testID="swap" />);
  await measure("swap");
  expect(screen.getByText("3 barras")).toBeTruthy();
  expect(seen.at(-1)?.bars[0].color).toBe(CHART_SERIES_LIGHT[0]);
  expect(seen.at(-1)?.frame.width).toBe(320);

  registerChartRenderers({ bar: null });
  await rerender(<Charts.Bar label="Ventas otra vez" series={series} testID="swap" />);
  expect(screen.queryByTestId("custom-bars")).toBeNull();
  expect(screen.getAllByTestId("svg-path")).toHaveLength(3);
});
