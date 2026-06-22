import { theme } from "@sincpro/mobile-ui/theme";
import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { LinearGradient, type LinearGradientPoint } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

/**
 * Decorative gradient presets (2026 art direction). `brand` is themeable (reads
 * `theme.gradient.primary`); the rest are intentional design constants for heroes/splash.
 * Each is [from, …, to].
 */
const GRADIENT_PRESETS = {
  "neon-teal": {
    colors: ["#22E584", "#0FB8A0"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  "night-green": {
    colors: ["#0B1410", "#0E2A1E", "#08120D"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  mesh: {
    colors: ["#0B1410", "#10B981", "#0B1410", "#1E1B8A"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  emerald: {
    colors: ["#00C357", "#00A862"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

export type GradientPreset = keyof typeof GRADIENT_PRESETS | "brand";

const surface = tv({
  variants: {
    radius: {
      none: "rounded-none",
      md: "rounded-xl",
      lg: "rounded-2xl",
      full: "rounded-full",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: { radius: "lg", padding: "none" },
});

export interface GradientSurfaceProps extends VariantProps<typeof surface> {
  /** Named brand preset. Ignored if `colors` is provided. */
  preset?: GradientPreset;
  /** Custom gradient stops (overrides `preset`). */
  colors?: readonly [string, string, ...string[]];
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
  children?: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Modern gradient surface (delivery/fintech 2026 look). Wraps `expo-linear-gradient` with
 * named brand presets + tokenized radius/padding. iOS + Android (no native dep beyond the
 * already-peer `expo-linear-gradient`). Replaces the legacy `GradientContainer`.
 */
function GradientSurface({
  preset = "neon-teal",
  colors,
  start,
  end,
  radius,
  padding,
  children,
  className,
  style,
  testID,
}: GradientSurfaceProps) {
  const p = preset === "brand" ? GRADIENT_PRESETS["neon-teal"] : GRADIENT_PRESETS[preset];
  const presetColors = preset === "brand" ? theme.gradient.primary : p.colors;
  const resolvedColors = (colors ?? presetColors) as readonly [string, string, ...string[]];

  return (
    <View
      className={cn("overflow-hidden", surface({ radius }))}
      style={style}
      testID={testID}
    >
      <LinearGradient
        colors={[...resolvedColors] as [string, string, ...string[]]}
        end={end ?? p.end}
        start={start ?? p.start}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className={cn(surface({ padding }), className)}>{children}</View>
    </View>
  );
}

export default GradientSurface;
export { GRADIENT_PRESETS, GradientSurface };
