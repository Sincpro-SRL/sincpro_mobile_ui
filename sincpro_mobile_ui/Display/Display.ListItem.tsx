import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable as NativePressable,
  type StyleProp,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

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
  density?: "compact" | "comfortable";
  style?: StyleProp<ViewStyle>;
  titleTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
  subtitleTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
  valueTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
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
  density = "compact",
  style,
  titleTextProps,
  subtitleTextProps,
  valueTextProps,
}: ListItemProps) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const mobile = variant === "mobile";
  const comfortable = mobile && density === "comfortable";
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
            variant={comfortable ? "bodyReadable" : "body"}
            {...valueTextProps}
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
          semibold={!mobile || comfortable}
          variant={comfortable ? "bodyReadable" : "body"}
          {...titleTextProps}
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            numberOfLines={mobile || accessibleSizing ? undefined : 1}
            variant={comfortable ? "bodyLarge" : "bodySmall"}
            {...subtitleTextProps}
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
    "flex-row items-center px-4",
    mobile && !comfortable ? "py-2" : "py-3",
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
          style={({ pressed }) => [
            {
              minHeight: 48,
              minWidth: 48,
              backgroundColor: pressed ? theme.bg.hover : undefined,
            },
            style,
          ]}
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
        style={[accessibleSizing ? { minHeight: 48 } : undefined, style]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={base} style={style} testID={testID}>
      {content}
    </View>
  );
}

export default ListItem;
