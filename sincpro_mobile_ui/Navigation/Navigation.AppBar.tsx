import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppBarActionProps {
  icon: string;
  onPress: () => void;
  badge?: string | number;
  accessibilityLabel?: string;
  /** `tinted` highlights (primary action); `plain` is the neutral contained default. */
  tone?: "plain" | "tinted";
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
  testID,
}: AppBarActionProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="items-center justify-center rounded-full"
      hitSlop={6}
      onPress={onPress}
      style={{
        width: 38,
        height: 38,
        backgroundColor: tone === "tinted" ? theme.bg.accent : theme.bg.muted,
      }}
      testID={testID}
    >
      <Icon
        color={tone === "tinted" ? theme.primary : theme.icon.primary}
        name={icon}
        size={20}
      />
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
  border = true,
  safeArea = true,
  className,
  testID,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const centered = variant === "center";

  return (
    <View
      className={cn("bg-bg-card", border && "border-b border-border-light", className)}
      style={{ paddingTop: safeArea ? insets.top : 0 }}
      testID={testID}
    >
      <View className="flex-row items-center px-3 gap-2 min-h-[56px]">
        <View className="flex-row items-center gap-2" style={{ minWidth: 38 }}>
          {onBack ? (
            <AppBarAction accessibilityLabel="Volver" icon="chevron-back" onPress={onBack} />
          ) : null}
          {leading}
        </View>

        {variant !== "large" ? (
          <View className={cn("flex-1", centered && "items-center")}>
            {title ? (
              <Typography.Text
                className="text-text-primary"
                numberOfLines={1}
                semibold
                variant="subtitle"
              >
                {title}
              </Typography.Text>
            ) : null}
            {subtitle ? (
              <Typography.Text
                className="text-text-secondary"
                numberOfLines={1}
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
          <Typography.Text className="text-text-primary" variant="h2">
            {title}
          </Typography.Text>
          {subtitle ? (
            <Typography.Text className="text-text-secondary" variant="bodySmall">
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
