/**
 * Runtime tests for the motion tokens. They are pure data, but freezing the values
 * here guards against accidental drift — many components compose from these, and a
 * typo in `duration.normal` cascades.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

async function loadModules() {
  return { tokens: await import("@sincpro/mobile-ui/tokens") };
}

describe("tokens/motion", () => {
  it("duration ladder is monotonically non-decreasing", async () => {
    const { tokens } = await loadModules();
    const d = tokens.duration as Record<string, number>;
    const keys = ["instant", "fast", "normal", "slow", "slower"] as const;
    for (let i = 1; i < keys.length; i++) {
      assert.ok(
        d[keys[i]] >= d[keys[i - 1]],
        `${keys[i]} (${d[keys[i]]}) should be >= ${keys[i - 1]} (${d[keys[i - 1]]})`,
      );
    }
  });

  it("instant is 0 (no transition)", async () => {
    const { tokens } = await loadModules();
    assert.equal(tokens.duration.instant, 0);
  });

  it("duration keys are non-negative integers", async () => {
    const { tokens } = await loadModules();
    for (const [key, value] of Object.entries(tokens.duration)) {
      assert.ok(Number.isInteger(value), `${key} must be integer (got ${value})`);
      assert.ok(value >= 0, `${key} must be >= 0 (got ${value})`);
    }
  });

  it("easing curves are 4-tuples of unit-ish floats", async () => {
    const { tokens } = await loadModules();
    for (const [key, curve] of Object.entries(tokens.easing)) {
      assert.ok(Array.isArray(curve), `${key} must be array`);
      assert.equal((curve as unknown[]).length, 4, `${key} must have 4 entries`);
      for (const v of curve as number[]) {
        assert.ok(
          v >= 0 && v <= 1,
          `${key} entry must be in [0,1] (got ${v})`,
        );
      }
    }
  });

  it("spring presets have damping, stiffness and mass", async () => {
    const { tokens } = await loadModules();
    for (const [key, preset] of Object.entries(tokens.spring)) {
      const p = preset as Record<string, number>;
      assert.ok(p.damping > 0, `${key}.damping must be > 0`);
      assert.ok(p.stiffness > 0, `${key}.stiffness must be > 0`);
      assert.ok(p.mass > 0, `${key}.mass must be > 0`);
    }
  });

  it("motion aggregates duration + easing + spring", async () => {
    const { tokens } = await loadModules();
    assert.deepEqual(Object.keys(tokens.motion).sort(), [
      "duration",
      "easing",
      "spring",
    ]);
    assert.equal(tokens.motion.duration, tokens.duration);
    assert.equal(tokens.motion.easing, tokens.easing);
    assert.equal(tokens.motion.spring, tokens.spring);
  });
});