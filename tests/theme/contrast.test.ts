/**
 * Tests for WCAG contrast helpers used by theme authors and validateTheme.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

async function load() {
  return import("@sincpro/mobile-ui/theme/contrast");
}

describe("theme/contrast", () => {
  it("resolveOnColor picks dark ink on light gold", async () => {
    const { resolveOnColor } = await load();
    assert.equal(resolveOnColor("#C9A84C"), "#0A0A0A");
  });

  it("resolveOnColor picks light ink on dark navy", async () => {
    const { resolveOnColor } = await load();
    assert.equal(resolveOnColor("#0B1F4A"), "#FFFFFF");
  });

  it("contrastRatio matches known CTA pair", async () => {
    const { contrastRatio } = await load();
    const ratio = contrastRatio("#0A0A0A", "#C9A84C");
    assert.ok(ratio >= 7, `expected AAA-ish, got ${ratio}`);
  });
});
