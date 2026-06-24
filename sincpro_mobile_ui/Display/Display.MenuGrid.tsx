import MenuCard from "@sincpro/mobile-ui/Display/Display.MenuCard";
import { IconType } from "@sincpro/mobile-ui/utils/icon";
import { ComponentType } from "react";
import { View } from "react-native";

export interface MenuGridItem {
  id: string;
  title: string;
  iconType?: IconType;
  onPress?: () => void;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
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
          customIcon={item.customIcon}
          iconType={item.iconType}
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
