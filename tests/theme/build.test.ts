/**
 * Tests for buildThemeFromBrand — seed → full ThemeTokens.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

async function load() {
  return {
    build: await import("@sincpro/mobile-ui/theme/build"),
    validate: await import("@sincpro/mobile-ui/theme/validate"),
  };
}

describe("theme/build", () => {
  it("builds a light theme from a brand seed with containers + state + material", async () => {
    const { build, validate } = await load();
    const t = build.buildThemeFromBrand({
      name: "acme-light",
      brand: "#0066FF",
      mode: "light",
    });
    assert.equal(t.name, "acme-light");
    assert.equal(t.primary, "#0066FF");
    assert.ok(t.container.primary);
    assert.ok(t.container.onPrimary);
    assert.ok(t.bg.containerLowest);
    assert.equal(typeof t.state.press, "number");
    assert.equal(typeof t.material.blur, "number");
    const issues = validate.validateTheme(t);
    assert.equal(issues.length, 0, JSON.stringify(issues));
  });

  it("builds a dark theme from a navy seed", async () => {
    const { build, validate } = await load();
    const t = build.buildThemeFromBrand({
      name: "acme-dark",
      brand: "#0B1F4A",
      mode: "dark",
    });
    assert.equal(t.text.onPrimary, "#FFFFFF");
    const issues = validate.validateTheme(t);
    assert.equal(issues.length, 0, JSON.stringify(issues));
  });
});
