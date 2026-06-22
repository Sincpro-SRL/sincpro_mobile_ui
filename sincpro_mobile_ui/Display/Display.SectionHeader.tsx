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
}

function SectionHeader({ title, subtitle, action, className, testID }: SectionHeaderProps) {
  return (
    <View
      className={cn("flex-row items-center justify-between px-4 py-2", className)}
      testID={testID}
    >
      <View className="flex-1">
        <Typography.Text className="text-text-primary" semibold variant="subtitle">
          {title}
        </Typography.Text>
        {subtitle ? (
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {subtitle}
          </Typography.Text>
        ) : null}
      </View>
      {action ? (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={action.onPress}>
          <Typography.Text className="text-primary text-sm font-semibold">
            {action.label}
          </Typography.Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default SectionHeader;
