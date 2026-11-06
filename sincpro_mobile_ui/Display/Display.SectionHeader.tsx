import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

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
  variant?: "default" | "mobile";
}

function SectionHeader({
  title,
  subtitle,
  action,
  className,
  testID,
  variant = "default",
}: SectionHeaderProps) {
  return (
    <View
      className={cn("flex-row items-center justify-between px-4 py-2", className)}
      testID={testID}
    >
      <View className="flex-1">
        <Typography.Text
          accessibilityRole="header"
          className="text-text-primary"
          semibold
          variant={variant === "mobile" ? "bodyReadable" : "subtitle"}
        >
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text
            className="text-text-secondary"
            variant={variant === "mobile" ? "bodyLarge" : "bodySmall"}
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
          style={{
            minHeight: 48,
            minWidth: 48,
            justifyContent: "center",
            marginLeft: 12,
            flexShrink: 1,
          }}
        >
          <Typography.Text className="text-text-accent text-sm font-semibold">
            {action.label}
          </Typography.Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default SectionHeader;
