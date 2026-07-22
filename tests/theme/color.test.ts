/**
 * Color primitive tests (HSL mix / container pairs).
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

async function load() {
  return import("@sincpro/mobile-ui/theme/color");
}

describe("theme/color", () => {
  it("round-trips a mid-gray hex through HSL", async () => {
    const { hexToHsl, hslToHex } = await load();
    assert.equal(hslToHex(hexToHsl("#808080")), "#808080");
  });

  it("mixHex blends toward white", async () => {
    const { mixHex } = await load();
    const out = mixHex("#000000", "#FFFFFF", 0.5);
    assert.equal(out, "#808080");
  });

  it("containerPair light is softer than seed", async () => {
    const { containerPair, hexToHsl } = await load();
    const seed = "#15803D";
    const pair = containerPair(seed, "light");
    assert.ok(hexToHsl(pair.container).l > hexToHsl(seed).l);
    assert.ok(pair.onContainer !== pair.container);
  });
});
