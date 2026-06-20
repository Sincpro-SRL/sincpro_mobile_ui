import { IconType } from "@sincpro/mobile-ui/utils/icon";
import { MenuCard } from "@sincpro/mobile-ui/widgets/MenuCard";
import React, { ComponentType } from "react";
import { View } from "react-native";

export interface MenuItem {
  id: string;
  title: string;
  iconType?: IconType;
  onPress?: () => void;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
}

interface MenuGridProps {
  readonly items: MenuItem[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <View className="flex-row flex-wrap justify-start p-2 bg-bg-page">
      {items.map((item) => (
        <MenuCard
          customIcon={item.customIcon}
          iconType={item.iconType}
          key={item.id}
          onPress={item.onPress}
          title={item.title}
        />
      ))}
    </View>
  );
};
