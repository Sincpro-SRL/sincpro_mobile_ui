/**
 * Runtime tests for the theme singleton: `setActiveTheme`, `getActiveTheme`, subscriber
 * notifications, version bumping, plus the validate-on-set dev-mode guard.
 */
import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";

(globalThis as { __DEV__?: boolean }).__DEV__ = true;

async function loadModules() {
  return {
    define: await import("@sincpro/mobile-ui/theme/define"),
    active: await import("@sincpro/mobile-ui/theme/active"),
  };
}

describe("theme/active", () => {
  beforeEach(async () => {
    // Reset to DEFAULT by re-installing a full token set. We pull from define to
    // keep the test resilient to schema changes.
    const { define, active } = await loadModules();
    const t = (define.defineTheme as (t: unknown) => { name: string })({ name: "test-reset" });
    (active.setActiveTheme as (t: unknown) => void)(t);
  });

  it("setActiveTheme mutates the singleton ref + preserves siblings", async () => {
    const { active, define } = await loadModules();
    const before = active.getActiveTheme() as unknown as { name: string; bg: { page: string } };
    const full = (define.defineTheme as (t: unknown) => { name: string; bg: { page: string } })({
      name: "mutated",
      bg: { page: before.bg.page },
    });
    (active.setActiveTheme as (t: unknown) => void)(full);
    assert.equal((active.getActiveTheme() as { name: string }).name, "mutated");
    assert.equal((active.getActiveTheme() as { bg: { page: string } }).bg.page, before.bg.page);
  });

  it("subscribers fire on every setActiveTheme call", async () => {
    const { active } = await loadModules();
    let calls = 0;
    const unsub = (active.subscribeTheme as (l: () => void) => () => void)(() => calls++);
    const ref = active.getActiveTheme() as unknown as Record<string, unknown>;
    (active.setActiveTheme as (t: unknown) => void)({ ...ref, name: "v2" });
    (active.setActiveTheme as (t: unknown) => void)({ ...ref, name: "v3" });
    assert.equal(calls, 2);
  });

  it("unsubscribed listeners stop receiving updates", async () => {
    const { active } = await loadModules();
    let calls = 0;
    const unsub = (active.subscribeTheme as (l: () => void) => () => void)(() => calls++);
    const ref = active.getActiveTheme() as unknown as Record<string, unknown>;
    unsub();
    (active.setActiveTheme as (t: unknown) => void)({ ...ref, name: "v4" });
    assert.equal(calls, 0);
  });

  it("getThemeVersion bumps on each set", async () => {
    const { active } = await loadModules();
    const v0 = (active.getThemeVersion as () => number)();
    const ref = active.getActiveTheme() as unknown as Record<string, unknown>;
    (active.setActiveTheme as (t: unknown) => void)({ ...ref, name: "v1" });
    (active.setActiveTheme as (t: unknown) => void)({ ...ref, name: "v2" });
    const v2 = (active.getThemeVersion as () => number)();
    assert.equal(v2 - v0, 2);
  });

  it("getThemeSnapshot is a new object per change; the static theme keeps its identity", async () => {
    const { active, define } = await loadModules();
    const set = active.setActiveTheme as (t: unknown) => void;
    const ref = active.getActiveTheme();
    const before = active.getThemeSnapshot();
    assert.equal(active.getThemeSnapshot(), before, "stable while nothing changes");
    set((define.defineTheme as (t: unknown) => unknown)({ name: "next" }));
    assert.notEqual(active.getThemeSnapshot(), before);
    assert.equal(active.getActiveTheme(), ref);
    assert.equal((active.getThemeSnapshot() as { name: string }).name, "next");
  });
});
