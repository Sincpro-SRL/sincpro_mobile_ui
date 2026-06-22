import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Fallback for the `tone="dark"` hero surface when the theme has no `bg.inverse` token. */
const HERO_DARK_FALLBACK = "#0E1714";

export interface AppBarActionProps {
  icon: string;
  onPress: () => void;
  badge?: string | number;
  accessibilityLabel?: string;
  /** `tinted` highlights (primary action); `plain` is the neutral contained default. */
  tone?: "plain" | "tinted";
  /** Render for a dark surface (translucent light button + light icon). */
  onDark?: boolean;
  /** Drop the contained surface → bare icon (iOS-style plain back/action). */
  bare?: boolean;
  testID?: string;
}

/**
 * "Contained" icon-button for the AppBar: circular touch area with a subtle surface
 * (merge of Material 3 state-layer + iOS 26 contained button). Optional badge.
 */
function AppBarAction({
  icon,
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
        ? theme.bg.accent
        : theme.bg.card;
  const iconColor =
    tone === "tinted" ? theme.primary : onDark ? theme.icon.inverse : theme.icon.primary;
  // Plain (white) squircle gets a hairline so it reads as a contained button on a light bar.
  const showBorder = !bare && !onDark && tone !== "tinted";
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
      <Icon color={iconColor} name={icon} size={bare ? 24 : 20} />
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
  /** `dark` renders an always-dark hero surface (light text + light contained actions). */
  tone?: "default" | "dark";
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
  backVariant = "contained",
  border = true,
  safeArea = true,
  className,
  testID,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const centered = variant === "center";
  const dark = tone === "dark";
  const titleStyle = dark ? { color: theme.text.inverse } : undefined;
  const subtitleStyle = dark ? { color: "rgba(255,255,255,0.7)" } : undefined;

  return (
    <View
      className={cn(
        dark ? "" : "bg-bg-card",
        !dark && border && "border-b border-border-light",
        className,
      )}
      style={{
        paddingTop: safeArea ? insets.top : 0,
        ...(dark ? { backgroundColor: theme.bg.inverse ?? HERO_DARK_FALLBACK } : null),
      }}
      testID={testID}
    >
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

        {variant !== "large" ? (
          <View className={cn("flex-1", centered && "items-center")}>
            {title ? (
              <Typography.Text
                className={dark ? "" : "text-text-primary"}
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
                className={dark ? "" : "text-text-secondary"}
                numberOfLines={1}
                style={subtitleStyle}
                variant="caption"
              >
                {subtitle}
              </Typography.Text>
            ) : null}
          </View>
        ) : (
          <View className="flex-1" />
        )}

        <View className="flex-row items-center justify-end gap-2" style={{ minWidth: 38 }}>
          {actions}
        </View>
      </View>

      {variant === "large" && title ? (
        <View className="px-4 pb-2 pt-0.5">
          <Typography.Text
            className={dark ? "" : "text-text-primary"}
            style={titleStyle}
            variant="h2"
          >
            {title}
          </Typography.Text>
          {subtitle ? (
            <Typography.Text
              className={dark ? "" : "text-text-secondary"}
              style={subtitleStyle}
              variant="bodySmall"
            >
              {subtitle}
            </Typography.Text>
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
