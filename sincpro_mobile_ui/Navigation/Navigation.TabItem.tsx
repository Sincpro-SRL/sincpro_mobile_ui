import { Display } from "@sincpro/mobile-ui/Display";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { ComponentType, FC } from "react";
import { View } from "react-native";

export interface TabIconProps {
  focused: boolean;
  size?: number;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
  type?: "custom" | "ionicons" | "fontawesome" | "material" | "fontawesome5";
  name?: any;
  className?: string;
}

const TabIcon: FC<TabIconProps> = ({
  focused,
  size = 24,
  customIcon,
  type = "custom",
  name,
  className,
}) => {
  return (
    <View
      className={cn(
        "justify-center items-center w-12 h-12 rounded-full",
        focused ? "bg-primary shadow-md" : "bg-transparent",
        className,
      )}
    >
      <Display.Icon
        color={focused ? "#FFFFFF" : "#6B7280"}
        customIcon={customIcon}
        name={name}
        size={size}
        type={type as any}
      />
    </View>
  );
};

export default TabIcon;
