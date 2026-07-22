import { contrastRatio, resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import type { ShadowStyle, ThemeTokens } from "@sincpro/mobile-ui/theme/types";

type Issue = { path: string; message: string };

/**
 * Lightweight sanity checks on a theme. Returns a list of issues; empty array means OK.
 * Not a hard validator — we don't want to over-constrain creative themes — just guards
 * against the common silent failures (typos in hex, negative sizes, missing primary,
 * WCAG P0 contrast violations on the key on-color pairs, semantic token collisions).
 *
 * Triggered automatically by `setActiveTheme` in dev mode (skipped under Node, since
 * tests intentionally pass partial themes). Can also be called directly.
 */
export function validateTheme(theme: Partial<ThemeTokens>): Issue[] {
  const issues: Issue[] = [];

  if (typeof theme.name !== "string" || theme.name.trim() === "") {
    issues.push({ path: "name", message: "Theme must have a non-empty `name`." });
  }

  if (!isHex(theme.primary)) {
    issues.push({ path: "primary", message: `Invalid hex color: ${String(theme.primary)}` });
  }
  if (!isHex(theme.accent)) {
    issues.push({ path: "accent", message: `Invalid hex color: ${String(theme.accent)}` });
  }
  if (!isHex(theme.bg?.page)) {
    issues.push({ path: "bg.page", message: `Invalid hex color: ${String(theme.bg?.page)}` });
  }
  if (!isHex(theme.text?.primary)) {
    issues.push({
      path: "text.primary",
      message: `Invalid hex color: ${String(theme.text?.primary)}`,
    });
  }

  if (theme.pattern) {
    if (!isFiniteSize(theme.pattern.size)) {
      issues.push({
        path: "pattern.size",
        message: `Tile size must be > 0 (got ${String(theme.pattern.size)}).`,
      });
    }
  }

  if (theme.shadow) {
    issues.push(...validateShadow("shadow.sm", theme.shadow.sm));
    issues.push(...validateShadow("shadow.md", theme.shadow.md));
    issues.push(...validateShadow("shadow.lg", theme.shadow.lg));
  }

  issues.push(...validateContrast(theme));
  issues.push(...validateSemanticDistinct(theme));

  return issues;
}

function isHex(value: unknown): boolean {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function isFiniteSize(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

function validateShadow(path: string, s: ShadowStyle): Issue[] {
  const out: Issue[] = [];
  if (typeof s.shadowColor !== "string" || s.shadowColor.trim() === "") {
    out.push({ path: `${path}.shadowColor`, message: "shadowColor must be a string." });
  }
  if (typeof s.shadowOpacity !== "number" || s.shadowOpacity < 0 || s.shadowOpacity > 1) {
    out.push({
      path: `${path}.shadowOpacity`,
      message: `shadowOpacity must be in [0, 1] (got ${s.shadowOpacity}).`,
    });
  }
  return out;
}

/**
 * WCAG 2.1 contrast validation. Checks the P0 on-color pairs that every consumer
 * relies on (CTA text/bg, focus ring, body text on surfaces). Flags any pair below the
 * AA minimum (3:1 for UI/non-text, 4.5:1 for body text). Returns warnings as Issue[]
 * entries — never throws — so the dev-mode warning stays non-fatal.
 */
function validateContrast(theme: Partial<ThemeTokens>): Issue[] {
  const issues: Issue[] = [];

  const checks: {
    fg: string | undefined;
    bg: string | undefined;
    min: 3 | 4.5;
    label: string;
  }[] = [
    {
      fg: theme.text?.onPrimary,
      bg: theme.primary,
      min: 4.5,
      label: "text.onPrimary on primary (CTA)",
    },
    {
      fg: theme.text?.onSecondary,
      bg: theme.secondary,
      min: 4.5,
      label: "text.onSecondary on secondary",
    },
    {
      fg: theme.text?.onAccent,
      bg: theme.accent,
      min: 4.5,
      label: "text.onAccent on accent",
    },
    { fg: theme.border?.focus, bg: theme.bg?.page, min: 3, label: "border.focus on bg.page" },
    { fg: theme.border?.focus, bg: theme.bg?.card, min: 3, label: "border.focus on bg.card" },
    {
      fg: theme.text?.onDanger,
      bg: theme.danger,
      min: 4.5,
      label: "text.onDanger on danger",
    },
    {
      fg: theme.text?.onSuccess,
      bg: theme.success,
      min: 4.5,
      label: "text.onSuccess on success",
    },
    {
      fg: theme.text?.accent,
      bg: theme.bg?.card,
      min: 4.5,
      label: "text.accent on bg.card (brand text)",
    },
    {
      fg: theme.text?.accent,
      bg: theme.bg?.page,
      min: 4.5,
      label: "text.accent on bg.page (brand text)",
    },
    {
      fg: theme.container?.onPrimary,
      bg: theme.container?.primary,
      min: 4.5,
      label: "container.onPrimary on container.primary",
    },
    {
      fg: theme.container?.onSuccess,
      bg: theme.container?.success,
      min: 4.5,
      label: "container.onSuccess on container.success",
    },
    {
      fg: theme.container?.onDanger,
      bg: theme.container?.danger,
      min: 4.5,
      label: "container.onDanger on container.danger",
    },
  ];

  for (const c of checks) {
    if (!isHex(c.fg) || !isHex(c.bg)) continue;
    const ratio = contrastRatio(c.fg as string, c.bg as string);
    if (ratio < c.min) {
      let message = `Contrast ratio ${ratio.toFixed(2)}:1 is below WCAG AA minimum ${c.min}:1 for body/UI text.`;
      if (c.label.includes("onPrimary") && isHex(theme.primary)) {
        const suggested = resolveOnColor(theme.primary as string);
        message += ` Use resolveOnColor(primary) → ${suggested}.`;
      }
      issues.push({ path: c.label, message });
    }
  }

  return issues;
}

/** Roles that must stay visually distinct for maintainable state semantics. */
function validateSemanticDistinct(theme: Partial<ThemeTokens>): Issue[] {
  const issues: Issue[] = [];

  const pairs: [string, string | undefined, string | undefined][] = [
    ["bg.disabled vs bg.muted", theme.bg?.disabled, theme.bg?.muted],
    ["text.disabled vs text.muted", theme.text?.disabled, theme.text?.muted],
    ["icon.disabled vs icon.secondary", theme.icon?.disabled, theme.icon?.secondary],
  ];

  for (const [label, a, b] of pairs) {
    if (!isHex(a) || !isHex(b)) continue;
    if (a!.trim().toLowerCase() === b!.trim().toLowerCase()) {
      issues.push({
        path: label,
        message: `Tokens share the same hex (${a}). Keep roles distinct so disabled/muted states stay maintainable.`,
      });
    }
  }

  if (theme.state) {
    for (const key of ["hover", "press", "focus", "drag"] as const) {
      const v = theme.state[key];
      if (typeof v !== "number" || v < 0 || v > 1) {
        issues.push({
          path: `state.${key}`,
          message: `State layer opacity must be in [0, 1] (got ${String(v)}).`,
        });
      }
    }
  }

  if (theme.material) {
    if (
      typeof theme.material.opacity === "number" &&
      (theme.material.opacity < 0 || theme.material.opacity > 1)
    ) {
      issues.push({
        path: "material.opacity",
        message: `material.opacity must be in [0, 1] (got ${theme.material.opacity}).`,
      });
    }
    if (
      typeof theme.material.blur === "number" &&
      (!Number.isFinite(theme.material.blur) || theme.material.blur < 0)
    ) {
      issues.push({
        path: "material.blur",
        message: `material.blur must be ≥ 0 (got ${theme.material.blur}).`,
      });
    }
  }

  return issues;
}
