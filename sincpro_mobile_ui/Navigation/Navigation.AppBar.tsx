import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Fallback for the `tone="dark"` hero surface when the theme has no `bg.inverse` token. */
const HERO_DARK_FALLBACK = "#0E1714";

export interface AppBarActionProps {
  /** Ionicon name. Optional when `label` is set (text-only CTA). */
  icon?: string;
  /** Text label → renders a pill CTA ("Editar", "Nuevo", "Guardar") instead of an icon circle. */
  label?: string;
  onPress: () => void;
  badge?: string | number;
  accessibilityLabel?: string;
  /** `tinted` highlights (primary action); `plain` is the neutral contained default. */
  tone?: "plain" | "tinted";
  /** Render for a dark surface (translucent light button + light icon). */
  onDark?: boolean;
  /** Drop the contained surface → bare icon/text (iOS-style plain back/action). */
  bare?: boolean;
  testID?: string;
}

/**
 * "Contained" icon-button for the AppBar: circular touch area with a subtle surface
 * (merge of Material 3 state-layer + iOS 26 contained button). Optional badge.
 * With `label`, renders a text pill CTA instead (for "Editar"/"Nuevo"/"Guardar").
 */
function AppBarAction({
  icon,
  label,
  onPress,
  badge,
  accessibilityLabel,
  tone = "plain",
  onDark = false,
  bare = false,
  testID,
}: AppBarActionProps) {
  const bg = bare
    ? "transparent"
    : onDark
      ? "rgba(255,255,255,0.14)"
      : tone === "tinted"
        ? theme.accent // solid brand-green squircle (FAB-style)
        : theme.bg.card;
  const iconColor =
    tone === "tinted"
      ? theme.text.onAccent // dark token on green surface
      : onDark
        ? theme.icon.inverse
        : theme.icon.primary;
  // Plain (white) squircle gets a hairline so it reads as a contained button on a light bar.
  const showBorder = !bare && !onDark && tone !== "tinted";

  // Labeled (text) action → a pill CTA. Distinct from the icon-only circle; use for
  // primary/secondary header actions like "Editar", "Nuevo", "Guardar".
  if (label) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-1.5"
        hitSlop={6}
        onPress={onPress}
        style={{
          height: 36,
          paddingHorizontal: 14,
          borderRadius: 999,
          backgroundColor: bg,
          ...(showBorder ? { borderWidth: 1, borderColor: theme.border.light } : null),
        }}
        testID={testID}
      >
        {icon ? <Icon color={iconColor} name={icon} size={16} /> : null}
        <Typography.Text semibold style={{ color: iconColor }} variant="bodySmall">
          {label}
        </Typography.Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="items-center justify-center"
      hitSlop={6}
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: bg,
        ...(showBorder ? { borderWidth: 1, borderColor: theme.border.light } : null),
      }}
      testID={testID}
    >
      <Icon color={iconColor} name={icon ?? "ellipse-outline"} size={bare ? 24 : 20} />
      {badge != null ? (
        <View
          className="absolute bg-danger rounded-full min-w-[16px] h-4 px-1 items-center justify-center"
          style={{ top: -2, right: -2, borderWidth: 2, borderColor: theme.bg.card }}
        >
          <Typography.Text style={{ color: theme.text.inverse, fontSize: 9, lineHeight: 11 }}>
            {badge}
          </Typography.Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export interface AppBarProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  leading?: ReactNode;
  actions?: ReactNode;
  subheader?: ReactNode;
  variant?: "default" | "large" | "center";
  /**
   * Surface tone:
   * - `default` — tokenized light card.
   * - `dark` — always-dark hero (light text + light contained actions).
   * - `gradient` — brand-accent gradient hero for greeting headers ("Buenos días, …"),
   *   with dark text via `text.onAccent` (reads `theme.gradient.accent`).
   */
  tone?: "default" | "dark" | "gradient";
  /** [large variant] Show a left vertical accent bar beside the large title. */
  accentBar?: boolean;
  /** Back button style: `contained` (circular surface) or `plain` (bare iOS chevron). */
  backVariant?: "contained" | "plain";
  border?: boolean;
  /** Reserves the status-bar space (insets.top). `false` to embed/demo. */
  safeArea?: boolean;
  className?: string;
  testID?: string;
}

/**
 * Flat, modern top bar (merge of Material 3 + iOS 26): tokenized surface, left-aligned
 * title + subtitle, **contained** icon-buttons (back and actions with a circular area),
 * a `subheader` slot (for SearchBar/Segmented below the title), and a `large` variant.
 * Replaces the gradient look of `Navigation.Header`/`ScreenHeader`.
 */
function AppBar({
  title,
  subtitle,
  onBack,
  leading,
  actions,
  subheader,
  variant = "default",
  tone = "default",
  accentBar = false,
  backVariant = "contained",
  border = true,
  safeArea = true,
  className,
  testID,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const centered = variant === "center";
  const large = variant === "large";
  const dark = tone === "dark";
  const gradient = tone === "gradient";
  // Large variant: back/leading + actions all live ON the big-title row (single cohesive
  // block — no separate top toolbar that would push the title to a new line). The compact
  // top toolbar is only for default/center.
  const largeHasNav = large && (!!onBack || !!leading);
  const showTopBar = !large;
  // Both `dark` and `gradient` are colored surfaces: no card bg, no hairline, light/dark text.
  const colored = dark || gradient;
  const onColoredText = gradient ? theme.text.onAccent : theme.text.inverse;
  const titleStyle = colored ? { color: onColoredText } : undefined;
  const subtitleStyle = gradient
    ? { color: theme.text.onAccent, opacity: 0.72 }
    : dark
      ? { color: "rgba(255,255,255,0.7)" }
      : undefined;

  // Large variant on a plain surface should feel like the page itself (no card surface, no
  // hairline). Compact variants (default/center) keep the card surface for detail screens.
  const largePlain = large && !colored;

  return (
    <View
      className={cn(
        colored ? "" : largePlain ? "bg-bg-page" : "bg-bg-card",
        !colored && !largePlain && border && "border-b border-border-light",
        className,
      )}
      style={{
        paddingTop: safeArea ? insets.top : 0,
        ...(dark ? { backgroundColor: theme.bg.inverse ?? HERO_DARK_FALLBACK } : null),
      }}
      testID={testID}
    >
      {gradient ? (
        <GradientSurface
          colors={theme.gradient.accent as readonly [string, string, ...string[]]}
          padding="none"
          radius="none"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {showTopBar ? (
        <View className="flex-row items-center px-3 gap-2 min-h-[56px]">
          <View className="flex-row items-center gap-2" style={{ minWidth: 38 }}>
            {onBack ? (
              <AppBarAction
                accessibilityLabel="Volver"
                bare={backVariant === "plain"}
                icon="chevron-back"
                onDark={dark}
                onPress={onBack}
              />
            ) : null}
            {leading}
          </View>

          <View className={cn("flex-1", centered && "items-center")}>
            {title ? (
              <Typography.Text
                className={colored ? "" : "text-text-primary"}
                numberOfLines={1}
                semibold
                style={titleStyle}
                variant="subtitle"
              >
                {title}
              </Typography.Text>
            ) : null}
            {subtitle ? (
              <Typography.Text
                className={colored ? "" : "text-text-secondary"}
                numberOfLines={1}
                style={subtitleStyle}
                variant="caption"
              >
                {subtitle}
              </Typography.Text>
            ) : null}
          </View>

          <View className="flex-row items-center justify-end gap-2" style={{ minWidth: 38 }}>
            {actions}
          </View>
        </View>
      ) : null}

      {large && title ? (
        <View
          className={cn("flex-row px-4 pt-2 pb-3", largeHasNav ? "items-center gap-2" : "")}
        >
          {/* back/leading inline with the big title — no extra row, no line break above it */}
          {onBack ? (
            <AppBarAction
              accessibilityLabel="Volver"
              bare={backVariant === "plain"}
              icon="chevron-back"
              onDark={dark}
              onPress={onBack}
            />
          ) : null}
          {leading}
          {accentBar && !largeHasNav ? (
            <View
              style={{
                width: 4,
                marginRight: 10,
                marginVertical: 2,
                borderRadius: 999,
                backgroundColor: theme.accent,
              }}
            />
          ) : null}
          <View className="flex-1">
            <Typography.Text
              className={colored ? "" : "text-text-primary"}
              style={titleStyle}
              variant="h2"
            >
              {title}
            </Typography.Text>
            {subtitle ? (
              <Typography.Text
                className={colored ? "" : "text-text-secondary"}
                style={subtitleStyle}
                variant="bodySmall"
              >
                {subtitle}
              </Typography.Text>
            ) : null}
          </View>
          {actions ? (
            <View
              className={cn(
                "flex-row items-center justify-end gap-2 pl-2",
                largeHasNav ? "" : "self-center",
              )}
            >
              {actions}
            </View>
          ) : null}
        </View>
      ) : null}

      {subheader ? <View className="px-3 pb-3 pt-0.5">{subheader}</View> : null}
    </View>
  );
}

const AppBarWithAction = Object.assign(AppBar, { Action: AppBarAction });

export default AppBarWithAction;
export { AppBarWithAction as AppBar };
