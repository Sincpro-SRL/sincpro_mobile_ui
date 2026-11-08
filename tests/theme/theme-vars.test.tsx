import { expect, test } from "@jest/globals";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { useThemeVars } from "@sincpro/mobile-ui/theme/useThemeVars";
import { act, render } from "@testing-library/react-native";

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
