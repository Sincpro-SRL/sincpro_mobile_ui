import { theme } from "@sincpro/mobile-ui/theme";
import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { LinearGradient, type LinearGradientPoint } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

/**
 * Decorative gradient presets. `brand` is themeable (reads `theme.gradient.primary`) —
 * use it when you want the surface to follow whatever the app's active theme defines.
 * Other presets are static constants for one-off uses. Each is [from, …, to].
 */
const GRADIENT_PRESETS = {
  warm: {
    colors: ["#1A1714", "#C89B3C", "#B88A2E"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  "neon-teal": {
    colors: ["#0F5C6E", "#5CC4D8"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  "night-green": {
    colors: ["#0B101E", "#18223A"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  mesh: {
    colors: ["#1C3765", "#2A4A85", "#8FA9E8"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  emerald: {
    colors: ["#2F6B3C", "#6FCF8B"] as const,
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
  /** Named gradient preset. Ignored if `colors` is provided. */
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

export function resolveGradientPreset(preset: GradientPreset = "warm") {
  const surface = preset === "brand" ? GRADIENT_PRESETS.warm : GRADIENT_PRESETS[preset];
  return {
    ...surface,
    colors: preset === "brand" ? theme.gradient.primary : surface.colors,
  };
}

/**
 * Modern gradient surface. Wraps `expo-linear-gradient` with named presets +
 * tokenized radius/padding. iOS + Android (no native dep beyond the already-peer
 * `expo-linear-gradient`). Replaces the legacy `GradientContainer`.
 */
function GradientSurface({
  preset = "warm",
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
  const p = resolveGradientPreset(preset);
  const resolvedColors = colors ?? p.colors;

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
