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
    colors: ["#4A3100", "#C9A84C", "#8B6914", "#F0D060"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
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

/**
 * Aliases kept for backwards compatibility. These were the original names; the
 * canonical ones are above. Use the canonical names in new code.
 * @deprecated use `warm` instead of `gold-mesh`.
 */
const DEPRECATED_PRESETS = {
  "gold-mesh": "warm",
} as const satisfies Record<string, keyof typeof GRADIENT_PRESETS>;

export type GradientPreset =
  | keyof typeof GRADIENT_PRESETS
  | keyof typeof DEPRECATED_PRESETS
  | "brand";

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
  const resolvedPreset = (
    preset in DEPRECATED_PRESETS
      ? DEPRECATED_PRESETS[preset as keyof typeof DEPRECATED_PRESETS]
      : preset
  ) as keyof typeof GRADIENT_PRESETS | "brand";
  const p =
    resolvedPreset === "brand" ? GRADIENT_PRESETS.warm : GRADIENT_PRESETS[resolvedPreset];
  const presetColors = resolvedPreset === "brand" ? theme.gradient.primary : p.colors;
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
