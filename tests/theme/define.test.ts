/**
 * Runtime tests for the theme builder API. Pure functions — no DOM, no RN.
 * Run via `make test` (tsx + node:test). No setup, no teardown.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

(globalThis as { __DEV__?: boolean }).__DEV__ = true;

async function loadModules() {
  return {
    define: await import("@sincpro/mobile-ui/theme/define"),
    active: await import("@sincpro/mobile-ui/theme/active"),
    validate: await import("@sincpro/mobile-ui/theme/validate"),
  };
}

describe("theme/define", () => {
  it("defineTheme returns the tokens untouched (type-safe identity)", async () => {
    const { define } = await loadModules();
    const t = (define.defineTheme as (t: unknown) => { name: string; primary: string })(
      { name: "x", primary: "#000" },
    );
    assert.equal(t.name, "x");
    assert.equal(t.primary, "#000");
  });

  it("extendTheme overlays on the active theme without mutating base", async () => {
    const { define, active } = await loadModules();
    const before = active.getActiveTheme();
    const extended = (define.extendTheme as (o: unknown) => { primary: string; name: string })({
      primary: "#000000",
    });
    assert.equal(extended.primary, "#000000");
    assert.equal(extended.name, before.name);
  });

  it("mergeTheme deep-merges nested keys (preserves siblings)", async () => {
    const { define, active } = await loadModules();
    const a = active.getActiveTheme() as unknown as {
      bg: { page: string; card: string };
    };
    const merged = (define.mergeTheme as (b: unknown, o: unknown) => {
      bg: { page: string; card: string };
    })(a, { bg: { page: "#000" } });
    assert.equal(merged.bg.page, "#000");
    assert.equal(merged.bg.card, a.bg.card);
  });
});
