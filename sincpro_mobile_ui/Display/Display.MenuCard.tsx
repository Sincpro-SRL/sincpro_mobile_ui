import type { IconName } from "@sincpro/mobile-ui/Display";
import CircleButton from "@sincpro/mobile-ui/Display/Display.CircleButton";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { TouchableOpacity, View } from "react-native";

export interface MenuCardProps {
  title: string;
  onPress?: () => void;
  icon: IconName;
  /** `"md"` = 2-column grid (default). `"sm"` = 3-column grid, smaller icon. */
  size?: "sm" | "md";
}

export function MenuCard({ title, onPress, icon, size = "md" }: MenuCardProps) {
  const theme = useTheme();
  const isSmall = size === "sm";

  return (
    <TouchableOpacity
      accessibilityLabel={title}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        backgroundColor: theme.bg.card,
        borderRadius: 16,
        padding: isSmall ? 12 : 16,
        margin: isSmall ? 4 : 8,
        width: isSmall ? "30%" : "45%",
        borderWidth: 1,
        borderColor: theme.border.default,
        ...theme.shadow.sm,
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <CircleButton icon={icon} size={isSmall ? "sm" : "md"} />
        <Typography.Text
          numberOfLines={2}
          style={{
            color: theme.text.primary,
            marginTop: isSmall ? 8 : 12,
            textAlign: "center",
          }}
          variant={isSmall ? "caption" : "label"}
        >
          {title}
        </Typography.Text>
      </View>
    </TouchableOpacity>
  );
}

export default MenuCard;
