import { ICON_FONT_FAMILY } from "@sincpro/mobile-ui/Display/icon-font";
import { MATERIAL_CODEPOINTS } from "@sincpro/mobile-ui/Display/icon-glyphs";
import {
  type BuiltInIconName,
  ICON_MAP,
  type IconName,
} from "@sincpro/mobile-ui/Display/icon-map";
import { customIconRenderer } from "@sincpro/mobile-ui/Display/icon-registry";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { SymbolView } from "expo-symbols";
import type { FC } from "react";
import {
  type ColorValue,
  Platform,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

export type IconProps = Omit<ViewProps, "children"> & {
  name: IconName;
  size?: number;
  color?: ColorValue;
  className?: string;
};

const FALLBACK: BuiltInIconName = "info";
const DEFAULT_SIZE = 24;
const LEGACY_PROPS = ["type", "customIcon", "fallback", "children"];
const reported = new Set<string>();

function reportOnce(message: string) {
  if (!__DEV__ || reported.has(message)) return;
  reported.add(message);
  console.error(`[Display.Icon] ${message}`);
}

function isBuiltIn(name: unknown): name is BuiltInIconName {
  return typeof name === "string" && Object.hasOwn(ICON_MAP, name);
}

/**
 * Rendered inline (not a component): one fiber per icon instead of two.
 * iOS: SF Symbols, native and stateless.
 * Android and web: one Material Symbols glyph in a Text — no effect, no
 * per-instance font load, a single render. Icons keep their size when the
 * system font scale grows, like @expo/vector-icons did.
 */
function glyph(name: BuiltInIconName, size: number, color: ColorValue) {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        accessibilityElementsHidden
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        name={ICON_MAP[name].sf}
        size={size}
        tintColor={color}
      />
    );
  }
  return (
    <Text
      accessibilityElementsHidden
      accessible={false}
      allowFontScaling={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.glyph,
        { color, fontSize: size, lineHeight: size, width: size, height: size },
      ]}
    >
      {String.fromCharCode(MATERIAL_CODEPOINTS[name])}
    </Text>
  );
}

const Icon: FC<IconProps> = ({
  name,
  size = DEFAULT_SIZE,
  color,
  className,
  style,
  accessible,
  accessibilityLabel,
  accessibilityRole,
  ...rest
}) => {
  const theme = useTheme();
  const tint = color ?? theme.text.primary;
  const validSize = Number.isFinite(size) && size > 0;
  if (!validSize) reportOnce(`Invalid size ${String(size)}. Using ${DEFAULT_SIZE}.`);
  const glyphSize = validSize ? size : DEFAULT_SIZE;

  const viewProps: Record<string, unknown> = { ...rest };
  for (const key of LEGACY_PROPS) {
    if (!Object.hasOwn(viewProps, key)) continue;
    reportOnce(`"${key}" is not supported. Register custom icons with registerIcons().`);
    delete viewProps[key];
  }

  const custom = typeof name === "string" ? customIconRenderer(name) : undefined;
  const builtIn = isBuiltIn(name) ? name : undefined;
  if (!custom && !builtIn)
    reportOnce(`Unknown icon "${String(name)}". Showing "${FALLBACK}".`);

  return (
    <View
      {...(viewProps as ViewProps)}
      {...(className ? { className } : null)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? (accessibilityLabel ? "image" : undefined)}
      accessible={accessible ?? Boolean(accessibilityLabel)}
      style={[styles.box, style]}
    >
      {custom
        ? custom({ size: glyphSize, color: tint })
        : glyph(builtIn ?? FALLBACK, glyphSize, tint)}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center" },
  glyph: {
    fontFamily: ICON_FONT_FAMILY,
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default Icon;
