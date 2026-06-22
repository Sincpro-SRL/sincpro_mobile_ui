import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
  className?: string;
  testID?: string;
}

function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  showDivider = true,
  className,
  testID,
}: ListItemProps) {
  const content = (
    <>
      {leading ? <View className="mr-3 justify-center">{leading}</View> : null}
      <View className="flex-1 gap-0.5">
        <Typography.Text
          className="text-text-primary"
          numberOfLines={1}
          semibold
          variant="body"
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            numberOfLines={1}
            variant="bodySmall"
          >
            {subtitle}
          </Typography.Text>
        ) : null}
      </View>
      {trailing ? <View className="ml-3 justify-center">{trailing}</View> : null}
    </>
  );

  const base = cn(
    "flex-row items-center py-3 px-4 bg-bg-card",
    showDivider && "border-b border-border-default",
    className,
  );

  if (onPress) {
    return (
      <Pressable className={base} onPress={onPress} testID={testID}>
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
