import { cn } from "@sincpro/mobile-ui/theme/tw";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, Line, Pattern as SvgPattern, Rect } from "react-native-svg";

export type PatternKind = "dots" | "grid" | "diagonals";

export interface PatternProps {
  /** Texture kind (img: puntos / grilla / diagonales). */
  kind?: PatternKind;
  /** Line/dot color (any color string; use a token value for theming). */
  color?: string;
  /** Stroke/dot opacity (0–1). Default 0.12. */
  opacity?: number;
  /** Tile size in px (texture density). Default 22. */
  size?: number;
  /** Absolute-fill the parent as a background layer. Default true. */
  absoluteFill?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Decorative SVG texture (dots / grid / diagonals) used as a background layer behind heroes,
 * splash, empty states. Tiles to any size via an SVG `<Pattern>`. Pure SVG — iOS + Android,
 * no native dep beyond `react-native-svg` (already a peer). Drop inside a relative/overflow
 * container (e.g. a `GradientSurface`).
 */
function Pattern({
  kind = "dots",
  color = "#FFFFFF",
  opacity = 0.12,
  size = 22,
  absoluteFill = true,
  className,
  style,
  testID,
}: PatternProps) {
  const id = `pat-${kind}-${size}`;

  const tile = (() => {
    switch (kind) {
      case "grid":
        return (
          <>
            <Line stroke={color} strokeWidth={1} x1={0} x2={size} y1={0} y2={0} />
            <Line stroke={color} strokeWidth={1} x1={0} x2={0} y1={0} y2={size} />
          </>
        );
      case "diagonals":
        return <Line stroke={color} strokeWidth={1.5} x1={0} x2={size} y1={size} y2={0} />;
      case "dots":
      default:
        return <Circle cx={size / 2} cy={size / 2} fill={color} r={1.4} />;
    }
  })();

  return (
    <View
      className={cn(className)}
      pointerEvents="none"
      style={[absoluteFill ? StyleSheet.absoluteFill : undefined, { opacity }, style]}
      testID={testID}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <SvgPattern
            height={size}
            id={id}
            patternUnits="userSpaceOnUse"
            width={size}
            x={0}
            y={0}
          >
            {tile}
          </SvgPattern>
        </Defs>
        <Rect fill={`url(#${id})`} height="100%" width="100%" />
      </Svg>
    </View>
  );
}

export default Pattern;
export { Pattern };
