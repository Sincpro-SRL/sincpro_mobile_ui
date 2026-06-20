/**
 * ============================================================================
 * THEME CONSTANT - Acceso directo al theme activo
 * ============================================================================
 *
 * Constante que resuelve automáticamente el theme según el dominio activo.
 * SOLO usar cuando className no es suficiente (RefreshControl, placeholderColor, etc.)
 *
 * @example
 * import { theme } from "./";
 * const color = theme.primary;
 */

import { getActiveTheme } from "./active";

export const theme = getActiveTheme();
