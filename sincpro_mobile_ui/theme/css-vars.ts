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
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Deriva las CSS variables (tripletes RGB para `rgb(var(--x) / <alpha>)`) a
 * partir del objeto de tokens tipado. Fuente ÚNICA: las clases (className) y el
 * objeto JS (style) salen del mismo `ThemeTokens`, sin posibilidad de divergir.
 *
 * State / material opacities are emitted as unitless numbers (not RGB).
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
    "--bg-container-lowest": rgb(t.bg.containerLowest),
    "--bg-container": rgb(t.bg.container),
    "--bg-container-high": rgb(t.bg.containerHigh),

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

    "--container-primary": rgb(t.container.primary),
    "--container-on-primary": rgb(t.container.onPrimary),
    "--container-secondary": rgb(t.container.secondary),
    "--container-on-secondary": rgb(t.container.onSecondary),
    "--container-accent": rgb(t.container.accent),
    "--container-on-accent": rgb(t.container.onAccent),
    "--container-success": rgb(t.container.success),
    "--container-on-success": rgb(t.container.onSuccess),
    "--container-warning": rgb(t.container.warning),
    "--container-on-warning": rgb(t.container.onWarning),
    "--container-danger": rgb(t.container.danger),
    "--container-on-danger": rgb(t.container.onDanger),
    "--container-info": rgb(t.container.info),
    "--container-on-info": rgb(t.container.onInfo),

    "--state-hover": String(t.state.hover),
    "--state-press": String(t.state.press),
    "--state-focus": String(t.state.focus),
    "--state-drag": String(t.state.drag),

    "--material-blur": String(t.material.blur),
    "--material-opacity": String(t.material.opacity),
    "--material-border-opacity": String(t.material.borderOpacity),

    "--ring": rgb(t.ring),
    "--input": rgb(t.input),
  };
}
