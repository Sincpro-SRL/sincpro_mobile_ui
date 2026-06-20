import { theme } from "@sincpro/mobile-ui/theme/useTheme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { IconType } from "@sincpro/mobile-ui/utils/icon";
import { CircleButton } from "@sincpro/mobile-ui/widgets/CircleButton";
import { ComponentType } from "react";
import { TouchableOpacity, View } from "react-native";

interface MenuCardProps {
  title: string;
  iconType?: IconType;
  onPress?: () => void;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
}

export function MenuCard({
  title,
  iconType = "ionicons",
  onPress,
  customIcon,
}: MenuCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-bg-card rounded-2xl p-4 m-2 w-[45%] shadow-sm"
      onPress={onPress}
      style={theme.shadow["sm"]}
    >
      <View className="items-center justify-center">
        <CircleButton customIcon={customIcon} iconType={iconType} />
        <Typography.Text className="text-text-primary mt-3 text-center" variant="label">
          {title}
        </Typography.Text>
      </View>
    </TouchableOpacity>
  );
}
