import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

const styles = StyleSheet.create({
  count: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  // An absolute child is measured against its parent, often a 24-point icon, so
  // "99+" wrapped and lost its "+". The anchor gives the badge room and no touches.
  anchor: { position: "absolute", width: 64, alignItems: "flex-end" },
  label: { fontSize: 10, lineHeight: 14, includeFontPadding: false },
});

export interface CountBadgeProps {
  /** Number or short text. Numbers above `max` read `max+`. */
  count?: number | string;
  max?: number;
  /** A bare dot instead of a count. */
  dot?: boolean;
  /** Fill of the badge. Defaults to `danger`. */
  color?: string;
  /** Ring that separates the badge from what it sits on. Defaults to the card surface. */
  ringColor?: string;
  /** Pins the badge over the top-right corner of its parent. */
  anchor?: { top: number; right: number };
  style?: StyleProp<ViewStyle>;
}

export function countLabel(count: number | string, max: number): string {
  return typeof count === "number" && count > max ? `${max}+` : String(count);
}

/** The one notification count of the DS: icon badges, app bar actions, tabs and menu rows. */
export function CountBadge({
  count,
  max = 99,
  dot = false,
  color,
  ringColor,
  anchor,
  style,
}: CountBadgeProps) {
  const theme = useTheme();
  const fill = {
    backgroundColor: color ?? theme.danger,
    borderColor: ringColor ?? theme.bg.card,
  };
  if (!dot && (count == null || count === "")) return null;
  const badge = dot ? (
    <View style={[styles.dot, fill, style]} />
  ) : (
    <View style={[styles.count, fill, style]}>
      <Typography.Text
        semibold
        style={[styles.label, { color: color ? theme.text.inverse : theme.text.onDanger }]}
        variant="labelSmall"
      >
        {countLabel(count ?? "", max)}
      </Typography.Text>
    </View>
  );
  if (!anchor) return badge;
  return (
    <View pointerEvents="none" style={[styles.anchor, anchor]}>
      {badge}
    </View>
  );
}
