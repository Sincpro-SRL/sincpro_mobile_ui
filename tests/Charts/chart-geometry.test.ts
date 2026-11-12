import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CHART_SERIES_DARK,
  CHART_SERIES_LIGHT,
  chartColors,
  seriesColor,
} from "@sincpro/mobile-ui/Charts/chart-colors";
import { describeSeries, describeSlices } from "@sincpro/mobile-ui/Charts/chart-describe";
import { axisFormatter } from "@sincpro/mobile-ui/Charts/chart-format";
import {
  barMarks,
  cartesianFrame,
  categoryAt,
  chartKeys,
  donutFrame,
  donutSlices,
  lineMarks,
  niceTicks,
  seriesValues,
  sliceAt,
  valueDomain,
} from "@sincpro/mobile-ui/Charts/chart-geometry";
import { DEFAULT_DARK_THEME } from "@sincpro/mobile-ui/theme/dark";
import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";

/** The horizontal extent of a bar path: its left and right x. */
function extent(path: string): [number, number] {
  const xs = [...path.matchAll(/[ML]([\d.-]+) /g)].map((match) => Number(match[1]));
  return [Math.min(...xs), Math.max(...xs)];
}

const frameOf = (keys: string[], domain: [number, number]) =>
  cartesianFrame({ width: 320, height: 200, keys, domain });

describe("chart data", () => {
  it("joins the keys of every series in order and marks missing values as null", () => {
    const series = [
      { name: "Ventas", data: [{ key: "Ene", value: 10 }, { key: "Feb", value: Number.NaN }] },
      { name: "Meta", data: [{ key: "Mar", value: 5 }, { key: "Ene", value: 8 }] },
    ];
    const keys = chartKeys(series);
    assert.deepEqual(keys, ["Ene", "Feb", "Mar"]);
    assert.deepEqual(seriesValues(series, keys), [
      [10, null, null],
      [8, null, 5],
    ]);
  });

  it("covers zero, and stacks each category per sign", () => {
    assert.deepEqual(valueDomain([[3, -2], [4, 6]], false), [-2, 6]);
    assert.deepEqual(valueDomain([[3, -2], [4, -6]], true), [-8, 7]);
  });

  it("ticks are round, include zero and cover the domain", () => {
    assert.deepEqual(niceTicks(0, 5400), [0, 2000, 4000, 6000]);
    assert.deepEqual(niceTicks(-300, 900), [-500, 0, 500, 1000]);
    assert.deepEqual(niceTicks(0, 0), [0, 0.25, 0.5, 0.75, 1]);
  });

  it("writes the axis in full under 10.000 and compact above, one style per axis", () => {
    assert.equal(axisFormatter([0, 2000, 4000])(2000), "2.000");
    assert.equal(axisFormatter([0, 25_000])(25_000), "25 k");
    assert.equal(axisFormatter([0, 1_500_000])(1_500_000), "1,5 M");
    assert.equal(axisFormatter([0, 1_500_000])(0), "0");
  });
});

describe("cartesian marks", () => {
  it("caps grouped bars at 24 points with a 2-point gap and skips zero and missing", () => {
    const frame = frameOf(["Ene", "Feb"], [0, 100]);
    const bars = barMarks(frame, [[60, 0], [40, null]], false);
    assert.deepEqual(
      bars.map((bar) => [bar.series, bar.index]),
      [
        [0, 0],
        [1, 0],
      ],
    );
    const [first, second] = bars.map((bar) => extent(bar.path));
    assert(first[1] - first[0] <= 24);
    assert.equal(Math.round((second[0] - first[1]) * 100) / 100, 2);
  });

  it("rounds only the outermost stacked segment and separates segments by the gap", () => {
    const frame = frameOf(["Ene"], [0, 100]);
    const [inner, outer] = barMarks(frame, [[60], [40]], true);
    assert.match(inner.path, /A0 0/);
    assert.match(outer.path, /A4 4/);
    assert(outer.path.startsWith(`M${extent(outer.path)[0]} ${frame.y(60) - 2}`));
  });

  it("breaks a line at a missing value and keeps a lone point as a dot", () => {
    const frame = frameOf(["1", "2", "3", "4"], [0, 4]);
    const [line] = lineMarks(frame, [[1, null, 3, 4]], true);
    assert.equal(line.path.match(/M/g)?.length, 2);
    assert.equal(line.area?.match(/M/g)?.length, 1);
    assert.deepEqual(line.isolated, [line.points[0]]);
    assert.deepEqual(line.end, line.points[3]);
    assert.equal(lineMarks(frame, [[1, 2]], false)[0].area, null);
  });

  it("selects the nearest category and clamps outside the plot", () => {
    const frame = frameOf(["Ene", "Feb", "Mar"], [0, 10]);
    assert.equal(categoryAt(frame, frame.centers[1] + 3), 1);
    assert.equal(categoryAt(frame, -50), 0);
    assert.equal(categoryAt(frame, 999), 2);
  });
});

describe("donut", () => {
  it("keeps positive parts and folds the smallest into Otros, in the given order", () => {
    const slices = donutSlices(
      [
        { key: "A", value: 50 },
        { key: "B", value: 5 },
        { key: "C", value: 30 },
        { key: "D", value: 0 },
        { key: "E", value: 10 },
        { key: "F", value: null },
      ],
      3,
      "Otros",
    );
    assert.deepEqual(slices, [
      { key: "A", value: 50 },
      { key: "C", value: 30 },
      { key: "Otros", value: 15 },
    ]);
  });

  it("splits the circle by share and finds the slice under the finger", () => {
    const frame = donutFrame(200, [1, 1, 2]);
    assert.deepEqual(
      frame.arcs.map((arc) => [arc.start, arc.end].map((angle) => angle / Math.PI)),
      [
        [0, 0.5],
        [0.5, 1],
        [1, 2],
      ],
    );
    const at = (angle: number, radius = 80) =>
      sliceAt(frame, 100 + radius * Math.sin(angle), 100 - radius * Math.cos(angle));
    assert.equal(at(Math.PI / 4), 0);
    assert.equal(at(Math.PI), 2);
    assert.equal(at(0, 0), null);
    assert.equal(sliceAt(frame, 0, 0), null);
  });

  it("draws a single part as a full ring", () => {
    const [arc] = donutFrame(120, [7]).arcs;
    assert.equal(arc.path.match(/Z/g)?.length, 2);
  });
});

describe("words and colors", () => {
  it("lists short series and summarizes long ones", () => {
    const format = (value: number) => String(value);
    assert.equal(
      describeSeries(["Ene", "Feb"], [{ name: "Ventas", color: "", values: [1, null] }], format),
      "Ventas: Ene 1",
    );
    const keys = Array.from({ length: 13 }, (_, index) => `d${index + 1}`);
    const values = keys.map((_, index) => (index === 4 ? 1 : index === 9 ? 99 : 50));
    assert.equal(
      describeSeries(keys, [{ name: "Cobros", color: "", values }], format),
      "Cobros: de d1 a d13; mínimo 1 (d5), máximo 99 (d10), último 50",
    );
    assert.match(
      describeSlices([{ key: "Bebidas", value: 1 }, { key: "Snacks", value: 3 }], format, "Total"),
      /^Total 4\. Bebidas 1, 25\s?%; Snacks 3, 75\s?%$/,
    );
  });

  it("follows the theme's surface and lets a theme pin its own palette", () => {
    assert.deepEqual(chartColors(DEFAULT_THEME).series, CHART_SERIES_LIGHT);
    assert.deepEqual(chartColors(DEFAULT_DARK_THEME).series, CHART_SERIES_DARK);
    const branded = chartColors({ ...DEFAULT_THEME, chart: { series: ["#111111"] } });
    assert.equal(seriesColor(branded, 0), "#111111");
    assert.equal(seriesColor(branded, 1), DEFAULT_THEME.text.tertiary);
    assert.equal(seriesColor(branded, 1, "#222222"), "#222222");
  });
});
