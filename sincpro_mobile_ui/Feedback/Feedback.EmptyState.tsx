import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { BaseButton } from "@sincpro/mobile-ui/primitives/BaseButton";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { Image, type ImageSourcePropType, View } from "react-native";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  image?: ImageSourcePropType;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
  testID?: string;
}

function EmptyState({
  title,
  description,
  icon = "file-tray-outline",
  image,
  actionLabel,
  onAction,
  children,
  className,
  testID,
}: EmptyStateProps) {
  return (
    <View
      className={cn("flex-1 items-center justify-center px-8 gap-3", className)}
      testID={testID}
    >
      {image ? (
        <Image resizeMode="contain" source={image} style={{ width: 140, height: 140 }} />
      ) : (
        <View className="w-20 h-20 rounded-full bg-bg-muted items-center justify-center">
          <Icon color={theme.icon.tertiary} name={icon} size={40} />
        </View>
      )}
      <Typography.Text
        align="center"
        className="text-text-primary"
        semibold
        variant="subtitle"
      >
        {title}
      </Typography.Text>
      {description ? (
        <Typography.Text align="center" className="text-text-secondary" variant="body">
          {description}
        </Typography.Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-2">
          <BaseButton onPress={onAction} title={actionLabel} variant="primary" />
        </View>
      ) : null}
      {children}
    </View>
  );
}

export default EmptyState;
