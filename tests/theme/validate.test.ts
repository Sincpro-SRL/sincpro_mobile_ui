/**
 * Runtime tests for `validateTheme`. It must be defensive (a malformed theme must not
 * crash — just report issues) and catch the common silent failures.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

type Issue = { path: string; message: string };

const baseValid = {
  name: "ok",
  primary: "#C9A84C",
  secondary: "#8B6914",
  accent: "#C9A84C",
  bg: { page: "#FAF8F3" },
  text: { primary: "#0A0A0A" },
  icon: { primary: "#0A0A0A" },
  border: { default: "#E5DEC8" },
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#2563EB",
  successLight: "#DCFCE7",
  warningLight: "#FEF3C7",
  dangerLight: "#FEE2E2",
  infoLight: "#DBEAFE",
  ring: "#C9A84C",
  input: "#E5DEC8",
  gradient: { primary: ["#000", "#111"] as const, accent: ["#000", "#111"] as const },
  shadow: {
    sm: { shadowColor: "#000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 0 },
    md: { shadowColor: "#000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 0 },
    lg: { shadowColor: "#000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 0 },
  },
};

async function loadModules() {
  return { validate: await import("@sincpro/mobile-ui/theme/validate") };
}

describe("theme/validate", () => {
  it("no issues for a valid theme", async () => {
    const { validate } = await loadModules();
    const out = (validate.validateTheme as (t: unknown) => Issue[])(baseValid);
    assert.equal(out.length, 0);
  });

  it("flags empty name", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      name: "",
    });
    assert.ok(issues.find((i) => i.path === "name"));
  });

  it("flags invalid hex in primary", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      primary: "not-a-hex",
    });
    assert.ok(issues.find((i) => i.path === "primary"));
  });

  it("flags negative pattern.size", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      pattern: { mode: "light-pattern", size: -10 },
    });
    assert.ok(issues.find((i) => i.path === "pattern.size"));
  });

  it("does not crash on a malformed theme", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      bg: { page: "#FFF" },
      text: { primary: "#000" },
      primary: "#123456",
    });
    assert.ok(Array.isArray(issues));
  });

  it("flags a CTA pair that fails WCAG AA (white on light gold)", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      primary: "#FFDD00",
      text: { ...baseValid.text, onPrimary: "#FFFFFF" },
    });
    const ctaIssue = issues.find((i) => i.path.includes("onPrimary"));
    assert.ok(ctaIssue, "expected WCAG violation for white on light gold CTA");
  });

  it("flags a focus ring that fails WCAG AA 3:1", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      border: { ...baseValid.border, focus: "#C9A84C" },
    });
    const focusIssue = issues.find((i) => i.path.includes("border.focus"));
    assert.ok(focusIssue, "expected WCAG violation for invisible focus ring");
  });

  it("does NOT flag a known-good default theme pair", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      primary: "#C9A84C",
      text: { ...baseValid.text, onPrimary: "#0A0A0A", accent: "#8B6914" },
      bg: { ...baseValid.bg, card: "#FFFFFF", page: "#FAF8F3" },
      border: { ...baseValid.border, focus: "#8B6914" },
    });
    const ctaIssue = issues.find((i) => i.path.includes("onPrimary"));
    const focusIssue = issues.find((i) => i.path.includes("border.focus"));
    assert.equal(ctaIssue, undefined, "expected no CTA contrast issue");
    assert.equal(focusIssue, undefined, "expected no focus ring contrast issue");
  });

  it("flags muted/disabled token collisions", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      bg: { page: "#FAF8F3", muted: "#F1ECDF", disabled: "#F1ECDF" },
      text: { primary: "#0A0A0A", muted: "#6B5A2E", disabled: "#6B5A2E" },
    });
    assert.ok(issues.find((i) => i.path.includes("bg.disabled")));
    assert.ok(issues.find((i) => i.path.includes("text.disabled")));
  });

  it("suggests resolveOnColor when CTA onPrimary fails AA", async () => {
    const { validate } = await loadModules();
    const issues = (validate.validateTheme as (t: unknown) => Issue[])({
      ...baseValid,
      primary: "#FFDD00",
      text: { ...baseValid.text, onPrimary: "#FFFFFF" },
    });
    const cta = issues.find((i) => i.path.includes("onPrimary"));
    assert.ok(cta, "expected CTA contrast issue");
    assert.ok(
      cta!.message.includes("resolveOnColor"),
      "expected resolveOnColor hint in the same issue message",
    );
  });
});
