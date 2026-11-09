import { expect, test } from "@jest/globals";
import {
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  setActiveTheme,
  useTheme,
} from "@sincpro/mobile-ui/theme";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import { useThemeVars } from "@sincpro/mobile-ui/theme/useThemeVars";
import { act, render } from "@testing-library/react-native";
import { useMemo } from "react";

test("theme variables keep one identity per theme version", async () => {
  const seen: unknown[] = [];
  function Probe({ tick }: { tick: number }) {
    seen.push(useThemeVars());
    return tick ? null : null;
  }
  const view = await render(<Probe tick={0} />);
  await view.rerender(<Probe tick={1} />);
  expect(seen[0]).toBe(seen[1]);
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(seen.at(-1)).not.toBe(seen[0]);
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("values memoized on useTheme() follow a light/dark switch", async () => {
  // React Compiler memoizes on the object useTheme() returns (`$[n] !== theme`); with the
  // mutated singleton, the canvas status bar and CountBadge ink kept the light theme.
  const inks: string[] = [];
  function Ink() {
    const theme = useTheme();
    const ink = useMemo(() => resolveOnColor(theme.bg.page), [theme]);
    inks.push(ink);
    return null;
  }
  await render(<Ink />);
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(inks[0]).toBe(resolveOnColor(DEFAULT_THEME.bg.page));
  expect(inks.at(-1)).toBe(resolveOnColor(DEFAULT_DARK_THEME.bg.page));
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("useTheme() keeps its identity while the theme does not change", async () => {
  const seen: unknown[] = [];
  function Probe({ tick }: { tick: number }) {
    seen.push(useTheme());
    return tick ? null : null;
  }
  const view = await render(<Probe tick={0} />);
  await view.rerender(<Probe tick={1} />);
  expect(seen[0]).toBe(seen[1]);
});
