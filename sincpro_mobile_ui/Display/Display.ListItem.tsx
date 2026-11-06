import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

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
}

function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  chevron = false,
  onPress,
  showDivider = true,
  className,
  testID,
  accessibleSizing = false,
  accessibilityLabel,
}: ListItemProps) {
  const right =
    trailing ??
    (chevron ? <Icon color={theme.icon.tertiary} name="chevron-forward" size={18} /> : null);
  const content = (
    <>
      {leading ? <View className="mr-3 justify-center">{leading}</View> : null}
      <View className="flex-1 gap-0.5">
        <Typography.Text
          className="text-text-primary"
          numberOfLines={accessibleSizing ? undefined : 1}
          semibold
          variant="body"
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            numberOfLines={accessibleSizing ? undefined : 1}
            variant="bodySmall"
          >
            {subtitle}
          </Typography.Text>
        ) : null}
      </View>
      {right ? <View className="ml-3 justify-center">{right}</View> : null}
    </>
  );

  const base = cn(
    "flex-row items-center py-3 px-4 bg-bg-card",
    showDivider && "border-b border-border-default",
    className,
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        className={base}
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
