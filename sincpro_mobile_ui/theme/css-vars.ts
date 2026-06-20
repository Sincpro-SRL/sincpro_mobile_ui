import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

function toRgbTriplet(color: string): string {
  const hex = color.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Deriva las CSS variables (tripletes RGB para `rgb(var(--x) / <alpha>)`) a
 * partir del objeto de tokens tipado. Fuente ÚNICA: las clases (className) y el
 * objeto JS (style) salen del mismo `ThemeTokens`, sin posibilidad de divergir.
 */
export function themeToVars(t: ThemeTokens): Record<string, string> {
  const rgb = toRgbTriplet;
  return {
    "--primary": rgb(t.primary),
    "--secondary": rgb(t.secondary),
    "--accent": rgb(t.accent),

    "--bg-page": rgb(t.bg.page),
    "--bg-card": rgb(t.bg.card),
    "--bg-popover": rgb(t.bg.popover),
    "--bg-muted": rgb(t.bg.muted),
    "--bg-accent": rgb(t.bg.accent),
    "--bg-hover": rgb(t.bg.hover),
    "--bg-disabled": rgb(t.bg.disabled),

    "--text-primary": rgb(t.text.primary),
    "--text-secondary": rgb(t.text.secondary),
    "--text-tertiary": rgb(t.text.tertiary),
    "--text-muted": rgb(t.text.muted),
    "--text-accent": rgb(t.text.accent),
    "--text-inverse": rgb(t.text.inverse),
    "--text-disabled": rgb(t.text.disabled),
    "--text-on-primary": rgb(t.text.onPrimary),
    "--text-on-secondary": rgb(t.text.onSecondary),
    "--text-on-accent": rgb(t.text.onAccent),
    "--text-on-danger": rgb(t.text.onDanger),
    "--text-on-success": rgb(t.text.onSuccess),

    "--icon-primary": rgb(t.icon.primary),
    "--icon-secondary": rgb(t.icon.secondary),
    "--icon-tertiary": rgb(t.icon.tertiary),
    "--icon-inverse": rgb(t.icon.inverse),
    "--icon-disabled": rgb(t.icon.disabled),

    "--border-default": rgb(t.border.default),
    "--border-light": rgb(t.border.light),
    "--border-strong": rgb(t.border.strong),
    "--border-focus": rgb(t.border.focus),

    "--success": rgb(t.success),
    "--warning": rgb(t.warning),
    "--danger": rgb(t.danger),
    "--info": rgb(t.info),
    "--success-light": rgb(t.successLight),
    "--warning-light": rgb(t.warningLight),
    "--danger-light": rgb(t.dangerLight),
    "--info-light": rgb(t.infoLight),

    "--ring": rgb(t.ring),
    "--input": rgb(t.input),
  };
}
