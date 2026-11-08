import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ComponentProps } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

export interface SectionHeaderAction {
  label: string;
  onPress: () => void;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: SectionHeaderAction;
  className?: string;
  testID?: string;
  /**
   * `default`/`mobile`: section heading (subtitle, semibold). `group`: the uppercase caption
   * that titles a group of rows, the same as `MenuSection`.
   */
  variant?: "default" | "mobile" | "group";
  titleTextProps?: Omit<
    ComponentProps<typeof Typography.Text>,
    "children" | "accessibilityRole"
  >;
  subtitleTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  actionStyle?: StyleProp<ViewStyle>;
  actionTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
}

function SectionHeader({
  title,
  subtitle,
  action,
  className,
  testID,
  variant = "default",
  titleTextProps,
  subtitleTextProps,
  style,
  contentStyle,
  actionStyle,
  actionTextProps,
}: SectionHeaderProps) {
  const group = variant === "group";
  return (
    <View
      className={cn("flex-row items-center justify-between px-4 py-2", className)}
      style={style}
      testID={testID}
    >
      <View className="flex-1" style={contentStyle}>
        <Typography.Text
          accessibilityRole="header"
          className={group ? "text-text-secondary" : "text-text-primary"}
          semibold
          transform={group ? "uppercase" : "none"}
          variant={group ? "caption" : "subtitle"}
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
      </View>
      {action ? (
        <Pressable
          accessibilityLabel={action.label}
          accessibilityRole="button"
          hitSlop={8}
          onPress={action.onPress}
          style={[
            {
              minHeight: 48,
              minWidth: 48,
              justifyContent: "center",
              marginLeft: 12,
              flexShrink: 1,
            },
            actionStyle,
          ]}
        >
          <Typography.Text className="text-text-accent" variant="button" {...actionTextProps}>
            {action.label}
          </Typography.Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default SectionHeader;
