import type { IconName } from "@sincpro/mobile-ui/Display";
import MenuCard from "@sincpro/mobile-ui/Display/Display.MenuCard";
import { View } from "react-native";

export interface MenuGridItem {
  id: string;
  title: string;
  onPress?: () => void;
  icon: IconName;
}

export interface MenuGridProps {
  items: MenuGridItem[];
  /** `"md"` = 2-column (default). `"sm"` = 3-column, smaller cards. */
  size?: "sm" | "md";
}

export function MenuGrid({ items, size = "md" }: MenuGridProps) {
  return (
    <View className="flex-row flex-wrap justify-start p-2 bg-bg-page">
      {items.map((item) => (
        <MenuCard
          icon={item.icon}
          key={item.id}
          onPress={item.onPress}
          size={size}
          title={item.title}
        />
      ))}
    </View>
  );
}

export default MenuGrid;
