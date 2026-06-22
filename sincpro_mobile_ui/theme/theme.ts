/**
 * ============================================================================
 * THEME CONSTANT - Acceso directo al theme activo
 * ============================================================================
 *
 * Constant that resolves the active theme automatically.
 * SOLO usar cuando className no es suficiente (RefreshControl, placeholderColor, etc.)
 *
 * @example
 * import { theme } from "@sincpro/mobile-ui/theme";
 * const color = theme.primary;
 */

import { getActiveTheme } from "@sincpro/mobile-ui/theme/active";

export const theme = getActiveTheme();
