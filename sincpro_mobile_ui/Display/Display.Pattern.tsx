import { getBrandingMesh, getBrandingMeshSize } from "@sincpro/mobile-ui/branding";
import { type PatternMode, theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import {
  Image as RNImage,
  type ImageSourcePropType,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  FeColorMatrix,
  Filter,
  Image as SvgImage,
  Line,
  Pattern as SvgPattern,
  Rect,
} from "react-native-svg";

const BUNDLED_MESH = require("../../assets/brand-mesh.png");

function resolveMesh(propOverride?: ImageSourcePropType): ImageSourcePropType {
  if (propOverride) return propOverride;
  const branded = getBrandingMesh();
  if (branded) return branded;
  return BUNDLED_MESH;
}

export type PatternKind = "dots" | "grid" | "diagonals" | "mesh";

/**
 * Resolved mesh params per mode. The bundled asset (`assets/brand-mesh.png`) is a
 * black symbol on transparent bg, so the two dark modes flip it via SVG ColorMatrix
 * to produce a light symbol on the dark surface. To swap the asset, pass `meshSrc` on
 * the `<Display.Pattern />` consumer or override `theme.pattern.source`.
 */
const MESH_PRESETS: Record<PatternMode, { opacity: number; invert: boolean; size: number }> =
  {
    "light-pattern": { opacity: 0.2, invert: false, size: 56 },
    "dark-pattern": { opacity: 0.25, invert: true, size: 56 },
    "dark-full": { opacity: 0.55, invert: true, size: 56 },
  };

export interface PatternProps {
  /** Texture kind (dots / grid / diagonals / mesh). mesh = symbol asset tiled via SVG <Image>. */
  kind?: PatternKind;
  /** Line/dot color (any color string; use a token value for theming). Ignored for `mesh`. */
  color?: string;
  /** Override the `mode` for `mesh`. Defaults to `theme.pattern.mode`. */
  mode?: PatternMode;
  /** Override tile opacity 0–1. Defaults per `mode`. */
  opacity?: number;
  /** Override tile size in px. Defaults per `mode`. */
  size?: number;
  /** Override invert (mesh only). Defaults per `mode`. */
  invert?: boolean;
  /** Override the mesh asset. Resolution order: this prop → `theme.pattern.source` →
   *  `setBranding({ mesh })` → bundled default `assets/brand-mesh.png`. */
  meshSrc?: ImageSourcePropType;
  /** Absolute-fill the parent as a background layer. Default true. */
  absoluteFill?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Decorative SVG texture used as a background layer. Geometric kinds (dots / grid /
 * diagonals) render inline SVG primitives; `mesh` tiles the symbol asset via
 * `<Pattern>` + `<Image>`, flipping it via SVG `<feColorMatrix>` on dark variants. The
 * three modes — `light-pattern` / `dark-pattern` / `dark-full` — are picked per screen
 * (or via `theme.pattern.mode`); see `MESH_PRESETS` for the resolved opacity/invert.
 * Pure SVG — iOS + Android, no native dep beyond `react-native-svg`.
 */
function Pattern({
  kind = "dots",
  color = "#FFFFFF",
  mode,
  opacity,
  size,
  invert,
  meshSrc,
  absoluteFill = true,
  className,
  style,
  testID,
}: PatternProps) {
  const isMesh = kind === "mesh";
  const fromTheme = isMesh ? theme.pattern : undefined;
  const brandedSize = isMesh ? getBrandingMeshSize() : undefined;
  const resolvedMode: PatternMode = mode ?? fromTheme?.mode ?? "light-pattern";
  const preset = MESH_PRESETS[resolvedMode];
  const resolvedSize =
    size ?? brandedSize ?? (isMesh ? (fromTheme?.size ?? preset.size) : 22);
  const resolvedOpacity = opacity ?? (isMesh ? preset.opacity : 0.12);
  const resolvedInvert = invert ?? (isMesh ? preset.invert : false);
  const resolvedMeshSrc = isMesh ? resolveMesh(meshSrc ?? fromTheme?.source) : undefined;

  const id = `pat-${kind}-${resolvedSize}-${resolvedInvert ? "inv" : "norm"}`;
  const filterId = `${id}-filter`;

  const tile = (() => {
    switch (kind) {
      case "grid":
        return (
          <>
            <Line stroke={color} strokeWidth={1} x1={0} x2={resolvedSize} y1={0} y2={0} />
            <Line stroke={color} strokeWidth={1} x1={0} x2={0} y1={0} y2={resolvedSize} />
          </>
        );
      case "diagonals":
        return (
          <Line
            stroke={color}
            strokeWidth={1.5}
            x1={0}
            x2={resolvedSize}
            y1={resolvedSize}
            y2={0}
          />
        );
      case "mesh": {
        if (!resolvedMeshSrc) return null;
        const mesh = RNImage.resolveAssetSource(resolvedMeshSrc);
        if (!mesh) return null;
        return (
          <SvgImage
            height={resolvedSize}
            href={mesh.uri}
            preserveAspectRatio="xMidYMid meet"
            width={resolvedSize}
            x={0}
            y={0}
          />
        );
      }
      case "dots":
      default:
        return <Circle cx={resolvedSize / 2} cy={resolvedSize / 2} fill={color} r={1.4} />;
    }
  })();

  return (
    <View
      className={cn(className)}
      pointerEvents="none"
      style={[
        absoluteFill ? StyleSheet.absoluteFill : undefined,
        { opacity: resolvedOpacity },
        style,
      ]}
      testID={testID}
    >
      <Svg height="100%" width="100%">
        <Defs>
          {resolvedInvert && isMesh && (
            <Filter id={filterId}>
              <FeColorMatrix
                type="matrix"
                values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
              />
            </Filter>
          )}
          <SvgPattern
            height={resolvedSize}
            id={id}
            patternUnits="userSpaceOnUse"
            width={resolvedSize}
            x={0}
            y={0}
          >
            {tile}
          </SvgPattern>
        </Defs>
        <Rect
          fill={`url(#${id})`}
          filter={resolvedInvert && isMesh ? `url(#${filterId})` : undefined}
          height="100%"
          width="100%"
        />
      </Svg>
    </View>
  );
}

export default Pattern;
export { MESH_PRESETS, Pattern };
