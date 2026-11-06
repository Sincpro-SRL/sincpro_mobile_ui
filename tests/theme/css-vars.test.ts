/**
 * Runtime tests for `themeToVars` — the bridge between `ThemeTokens` and the CSS
 * variables used by NativeWind preset classes. Single source: className + JS style
 * both come from the same tokens.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

async function loadModules() {
  return {
    cssVars: await import("@sincpro/mobile-ui/theme/css-vars"),
    defaults: await import("@sincpro/mobile-ui/theme/default"),
  };
}

describe("theme/css-vars", () => {
  it("emits all expected CSS variable keys for DEFAULT_THEME", async () => {
    const { cssVars, defaults } = await loadModules();
    const out = cssVars.themeToVars(defaults.DEFAULT_THEME);
    const expectedKeys = [
      "--primary",
      "--bg-container-lowest",
      "--bg-container",
      "--bg-container-high",
      "--container-primary",
      "--container-on-primary",
      "--container-success",
      "--container-on-success",
      "--state-press",
      "--material-blur",
      "--ring",
      "--input",
    ];
    for (const key of expectedKeys) {
      assert.ok(key in out, `expected ${key} in vars output`);
    }
  });

  it("converts 6-digit hex to space-separated RGB triplet", async () => {
    const { cssVars, defaults } = await loadModules();
    const out = cssVars.themeToVars(defaults.DEFAULT_THEME);
    assert.equal(out["--primary"], "42 74 133");
    assert.equal(out["--bg-card"], "255 255 255");
  });

  it("expands 3-digit hex shorthand to full RGB triplet", async () => {
    const { cssVars, defaults } = await loadModules();
    const out = cssVars.themeToVars({
      ...defaults.DEFAULT_THEME,
      primary: "#abc",
    });
    assert.equal(out["--primary"], "170 187 204");
  });

  it("strips leading # before parsing", async () => {
    const { cssVars, defaults } = await loadModules();
    const out = cssVars.themeToVars({
      ...defaults.DEFAULT_THEME,
      accent: "#000000",
    });
    assert.equal(out["--accent"], "0 0 0");
  });

  it("ignores leading/trailing whitespace around hex", async () => {
    const { cssVars, defaults } = await loadModules();
    const out = cssVars.themeToVars({
      ...defaults.DEFAULT_THEME,
      primary: "  #FF8800  ",
    });
    assert.equal(out["--primary"], "255 136 0");
  });

  it("returns the same key set for any theme shape (deterministic surface)", async () => {
    const { cssVars, defaults } = await loadModules();
    const a = cssVars.themeToVars(defaults.DEFAULT_THEME);
    const b = cssVars.themeToVars({
      ...defaults.DEFAULT_THEME,
      primary: "#000001",
    });
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort());
  });
});
