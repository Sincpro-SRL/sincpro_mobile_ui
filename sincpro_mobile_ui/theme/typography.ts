import { FiraCode_400Regular, FiraCode_500Medium } from "@expo-google-fonts/fira-code";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import type { TextStyle } from "react-native";

// Re-exports so consumers can declare fonts explicitly without installing extra deps.
export {
  FiraCode_400Regular,
  FiraCode_500Medium,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
};

/* -------------------- Font Families (configurables por la app) --------------------
 * La LIBRERÍA no shippea ni carga fuentes: solo referencia NOMBRES de familia por rol.
 * Cada app (o el Storybook, como ejemplo) carga sus archivos y los enchufa con
 * `configureFonts({...})`. Defaults seguros = Inter (body) + Fira Code (mono); el rol
 * "title" cae a Inter hasta que la app configure su tipo de marca (p.ej. Satoshi).
 *
 * `fontFamilies` es un singleton MUTABLE (igual que `theme`): `configureFonts` hace
 * Object.assign in-place, así los componentes que lo leen en render ven el cambio. */
export type FontRole =
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "extraBold"
  | "mono"
  | "monoMedium"
  | "titleRegular"
  | "titleMedium"
  | "title"
  | "titleBlack";

const DEFAULT_FONT_FAMILIES: Record<FontRole, string> = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  extraBold: "Inter_800ExtraBold",
  mono: "FiraCode_400Regular",
  monoMedium: "FiraCode_500Medium",
  // Título: default Inter (seguro). Storybook/app lo apunta a Satoshi vía configureFonts.
  titleRegular: "Inter_400Regular",
  titleMedium: "Inter_500Medium",
  title: "Inter_600SemiBold",
  titleBlack: "Inter_800ExtraBold",
};

export const fontFamilies: Record<FontRole, string> = { ...DEFAULT_FONT_FAMILIES };

/**
 * Configura las familias de fuente del DS (rol → nombre de familia ya cargada por la app).
 * Mutación in-place del singleton, así los componentes la leen en vivo. Ejemplo:
 * `configureFonts({ title: "Satoshi-Bold", titleBlack: "Satoshi-Black" })`.
 */
export function configureFonts(overrides: Partial<Record<FontRole, string>>): void {
  Object.assign(fontFamilies, overrides);
}

/** Restablece las familias a los defaults (Inter + Fira Code). Útil en tests/stories. */
export function resetFonts(): void {
  Object.assign(fontFamilies, DEFAULT_FONT_FAMILIES);
}

export const fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  extraBold: "800",
  mono: "400",
  monoMedium: "500",
  titleRegular: "400",
  titleMedium: "500",
  title: "700",
  titleBlack: "900",
} as const;

/* -------------------- Font Sizes -------------------- */
export const fontSizes = {
  xs: 10,
  sm: 13,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
  "6xl": 36,
  "7xl": 48,
  "8xl": 64,
} as const;

/* -------------------- Line Heights -------------------- */
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

/* -------------------- Letter Spacing -------------------- */
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

/* -------------------- Typography Variants -------------------- */
export const typographyVariants = {
  // Display (Satoshi Black — carácter de marca)
  display: {
    fontSize: fontSizes["7xl"],
    fontFamily: fontFamilies.titleBlack,
    fontWeight: fontWeights.titleBlack,
    lineHeight: fontSizes["7xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Headings (Satoshi Bold)
  h1: {
    fontSize: fontSizes["5xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["5xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes["4xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["4xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: fontSizes["3xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["3xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes["2xl"] * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Label
  label: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Data — cifras, montos, SKU, % (mono Fira Code, peso medio). DS spec rol "data".
  data: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.monoMedium,
    fontWeight: fontWeights.monoMedium,
    lineHeight: fontSizes.lg * lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  dataLarge: {
    fontSize: fontSizes["4xl"],
    fontFamily: fontFamilies.monoMedium,
    fontWeight: fontWeights.monoMedium,
    lineHeight: fontSizes["4xl"] * lineHeights.none,
    letterSpacing: letterSpacing.tight,
  },
  // Overline — labels/metadata en mono MAYÚSCULAS con tracking. DS spec rol "caption".
  overline: {
    fontSize: 11,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: 11 * lineHeights.snug,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // Caption — Fira Code mono (secundario, metadata, labels de datos)
  caption: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  captionSmall: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Buttons
  button: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.base * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.sm * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.lg * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },

  // Legacy
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/* -------------------- Variant → Font Role --------------------
 * Cada variante apunta a un ROL de fuente (no a una familia fija), para que
 * `configureFonts` la cambie en vivo. `Typography.Text` resuelve `fontFamilies[rol]`
 * en render. La familia "baked" de cada variante arriba queda solo como fallback. */
export const variantFontRole: Record<keyof typeof typographyVariants, FontRole> = {
  display: "titleBlack",
  h1: "titleBlack",
  h2: "title",
  h3: "title",
  h4: "medium",
  h5: "medium",
  h6: "medium",
  bodyLarge: "regular",
  body: "regular",
  bodySmall: "regular",
  label: "medium",
  labelSmall: "medium",
  data: "monoMedium",
  dataLarge: "monoMedium",
  overline: "mono",
  caption: "mono",
  captionSmall: "mono",
  button: "semiBold",
  buttonSmall: "semiBold",
  buttonLarge: "semiBold",
  title: "semiBold",
  subtitle: "medium",
};

/* -------------------- Utility Functions -------------------- */
export const createTextStyle = (
  variant: keyof typeof typographyVariants,
  overrides?: Partial<TextStyle>,
): TextStyle => ({
  ...typographyVariants[variant],
  ...overrides,
});

export const createCustomTextStyle = (
  fontSize: keyof typeof fontSizes,
  fontFamily: keyof typeof fontFamilies,
  options?: {
    lineHeight?: keyof typeof lineHeights;
    letterSpacing?: keyof typeof letterSpacing;
    color?: string;
  },
): TextStyle => {
  const size = fontSizes[fontSize];
  const line = options?.lineHeight ? lineHeights[options.lineHeight] : lineHeights.normal;
  const spacing = options?.letterSpacing ?? "normal";

  return {
    fontSize: size,
    fontFamily: fontFamilies[fontFamily],
    fontWeight: fontWeights[fontFamily],
    lineHeight: size * line,
    letterSpacing: letterSpacing[spacing],
    ...(options?.color && { color: options.color }),
  };
};

/* Re-export useFonts so consumers (e.g. the framework) can load fonts without
 * depending directly on expo-font — it's already a transitive dep via this package. */
export { useFonts };

/* -------------------- Font Loader (opcional, conveniencia) --------------------
 * Carga las fuentes recomendadas (Inter + Fira Code), que la app instala como peer deps.
 * El rol "title" (Satoshi u otra) lo carga y enchufa la app/Storybook por su cuenta vía
 * `configureFonts` — la librería NO bundlea archivos de fuente. */
export const useAppFonts = () => {
  const [loaded] = useFonts({
    FiraCode_400Regular,
    FiraCode_500Medium,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });
  return loaded;
};

/* -------------------- Typography Object -------------------- */
export const Typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  variants: typographyVariants,
  variantFontRole,
  createTextStyle,
  createCustomTextStyle,
  configureFonts,
  resetFonts,
  useAppFonts,
} as const;

export default Typography;
