/**
 * Ink on the fixed dark surfaces of the DS — brand gradients, splash screens, promos and media.
 * Those surfaces keep their colors in light and dark mode, so their ink cannot come from a
 * mode-aware token (`text.inverse` turns dark in dark mode). Values are the AppBar's.
 */
export const ON_DARK_SURFACE = {
  ink: "#FFFFFF",
  muted: "rgba(255,255,255,0.7)",
  glass: "rgba(255,255,255,0.14)",
} as const;

/** Dims the screen behind a modal surface (sheets, promo modal). */
export const SCRIM = "rgba(0,0,0,0.4)";
