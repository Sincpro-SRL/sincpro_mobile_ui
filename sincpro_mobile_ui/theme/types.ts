/**
 * ============================================================================
 * THEME SYSTEM - SIMPLE & SEMANTIC
 * ============================================================================
 *
 * Sistema simplificado de theming sin hooks ni context.
 * Importación directa de tokens según dominio activo.
 */

// ----------------------------------------------------------------------------
// Shadow Tokens (React Native)
// ----------------------------------------------------------------------------

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// ----------------------------------------------------------------------------
// Theme Tokens (SIMPLIFICADO)
// ----------------------------------------------------------------------------

export interface ThemeTokens {
  /** Nombre del theme */
  name: string;

  /** Color primario - botones principales, links, estados activos */
  primary: string;

  /** Color secundario - botones secundarios, elementos de bajo perfil (gris) */
  secondary: string;

  /** Color de acento - highlights, badges importantes, CTAs secundarios (naranja/indigo) */
  accent: string;

  /** Fondos */
  bg: {
    page: string; // Fondo de pantallas
    card: string; // Cards, modales, inputs
    popover: string; // Dropdowns, tooltips, context menus
    muted: string; // Superficies secundarias, filas alternas
    accent: string; // Estados seleccionados, filas activas
    hover: string; // Hover states
    disabled: string; // Disabled states
  };

  /** Textos */
  text: {
    primary: string; // Texto principal
    secondary: string; // Texto secundario
    tertiary: string; // Placeholders, texto terciario
    muted: string; // Texto sobre bg.muted
    accent: string; // Texto sobre bg.accent
    inverse: string; // Texto sobre colores (blanco)
    disabled: string; // Texto disabled
    onPrimary: string; // Texto sobre color primary
    onSecondary: string; // Texto sobre color secondary (gris)
    onAccent: string; // Texto sobre color accent
    onDanger: string; // Texto sobre color danger
    onSuccess: string; // Texto sobre color success
  };
  /** Iconos */
  icon: {
    primary: string; // Icono principal
    secondary: string; // Icono secundario
    tertiary: string; // Icono terciario
    inverse: string; // Icono sobre colores (blanco)
    disabled: string; // Icono disabled
  };
  /** Bordes */
  border: {
    default: string; // Bordes normales
    light: string; // Bordes suaves
    strong: string; // Bordes marcados
    focus: string; // Color de focus
  };

  /** Estados semánticos */
  success: string;
  warning: string;
  danger: string;
  info: string;

  /** Estados semánticos - Versiones claras */
  successLight: string;
  warningLight: string;
  dangerLight: string;
  infoLight: string;

  /** Focus & Input */
  ring: string; // Focus outline color
  input: string; // Input border color

  /** Gradientes (para LinearGradient) */
  gradient: {
    primary: readonly [string, string];
    accent: readonly [string, string];
  };

  /** Sombras (React Native) */
  shadow: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
}
