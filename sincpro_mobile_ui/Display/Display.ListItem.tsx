import { Chevron } from "@sincpro/mobile-ui/Display/chevron";
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

const TOUCH_TARGET = { minHeight: 48, minWidth: 48 } as const;

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
            variant="body"
            {...valueTextProps}
          >
            {value}
          </Typography.Text>
        ) : null}
        {chevron ? <Chevron /> : null}
      </View>
    ) : null);
  const content = (
    <>
      {leading ? <View className="mr-3 justify-center">{leading}</View> : null}
      <View className={cn("flex-1", mobile ? "min-w-0 gap-1" : "gap-0.5")}>
        <Typography.Text
          className={mobile && disabled ? "text-text-disabled" : "text-text-primary"}
          semibold={!mobile || comfortable}
          variant="body"
          {...titleTextProps}
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            variant="bodySmall"
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
      // The native Pressable is only the touch target; the row surface (classes, style,
      // pressed background) is the inner View. A className on Pressable routes it
      // through the NativeWind interop, which re-renders the row on every touch.
      // `content` keeps its identity, so a press repaints the surface, not the texts.
      return (
        <NativePressable
          accessibilityHint={accessibilityHint ?? subtitle}
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          accessibilityValue={value !== undefined ? { text: value } : undefined}
          disabled={disabled}
          onPress={onPress}
          style={TOUCH_TARGET}
          testID={testID}
        >
          {({ pressed }) => (
            <View
              className={base}
              style={[TOUCH_TARGET, pressed && { backgroundColor: theme.bg.hover }, style]}
            >
              {content}
            </View>
          )}
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
        style={[{ minHeight: 48, minWidth: 48 }, style]}
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
