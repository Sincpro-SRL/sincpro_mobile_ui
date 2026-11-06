import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { Pressable as NativePressable, useWindowDimensions, View } from "react-native";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Leading slot — icon, avatar, status dot. */
  leading?: ReactNode;
  /** Trailing slot — value text, toggle, badge. Overrides the auto `chevron`. */
  trailing?: ReactNode;
  /** Show a forward chevron on the right (navigational row). Ignored if `trailing` is set. */
  chevron?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
  className?: string;
  testID?: string;
  accessibleSizing?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  variant?: "default" | "mobile";
  value?: string;
  layout?: "auto" | "row" | "stacked";
}

function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  chevron = false,
  onPress,
  showDivider,
  className,
  testID,
  accessibleSizing = false,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  variant = "default",
  value,
  layout = "auto",
}: ListItemProps) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const mobile = variant === "mobile";
  const stacked =
    mobile &&
    (value !== undefined || trailing != null) &&
    (layout === "stacked" || (layout === "auto" && (fontScale > 1.3 || width < 360)));
  const right =
    trailing ??
    (value || chevron ? (
      <View className="flex-row items-center gap-2">
        {value ? (
          <Typography.Text
            className="text-text-secondary flex-shrink"
            variant={mobile ? "bodyReadable" : "body"}
          >
            {value}
          </Typography.Text>
        ) : null}
        {chevron ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Icon color={theme.icon.tertiary} name="chevron-forward" size={18} />
          </View>
        ) : null}
      </View>
    ) : null);
  const content = (
    <>
      {leading ? <View className="mr-3 justify-center">{leading}</View> : null}
      <View className={cn("flex-1", mobile ? "min-w-0 gap-1" : "gap-0.5")}>
        <Typography.Text
          className={mobile && disabled ? "text-text-disabled" : "text-text-primary"}
          numberOfLines={mobile || accessibleSizing ? undefined : 1}
          semibold
          variant={mobile ? "bodyReadable" : "body"}
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            numberOfLines={mobile || accessibleSizing ? undefined : 1}
            variant={mobile ? "bodyLarge" : "bodySmall"}
          >
            {subtitle}
          </Typography.Text>
        ) : null}
        {stacked && right ? <View className="self-start mt-1">{right}</View> : null}
      </View>
      {!stacked && right ? (
        <View
          className={cn("ml-3 justify-center", mobile && "flex-shrink")}
          style={mobile ? { maxWidth: "45%" } : undefined}
        >
          {right}
        </View>
      ) : null}
    </>
  );

  const base = cn(
    "flex-row items-center py-3 px-4",
    !mobile && "bg-bg-card",
    (showDivider ?? !mobile) && "border-b border-border-default",
    disabled && !mobile && "opacity-50",
    className,
  );

  if (onPress) {
    if (mobile) {
      return (
        <NativePressable
          accessibilityHint={accessibilityHint ?? subtitle}
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          accessibilityValue={value !== undefined ? { text: value } : undefined}
          className={base}
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => ({
            minHeight: 48,
            minWidth: 48,
            backgroundColor: pressed ? theme.bg.hover : undefined,
          })}
          testID={testID}
        >
          {content}
        </NativePressable>
      );
    }
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        className={base}
        disabled={disabled}
        onPress={onPress}
        style={accessibleSizing ? { minHeight: 48 } : undefined}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={base} testID={testID}>
      {content}
    </View>
  );
}

export default ListItem;
