import { ComponentType } from "react";
import { View } from "react-native";

import { Display } from "../Display";
import { cn } from "../theme/tw";

const Icon = Display.Icon;

interface TabIconProps {
  focused: boolean;
  size?: number;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
  type?: "custom" | "ionicons" | "fontawesome" | "material" | "fontawesome5";
  name?: any;
  className?: string;
}

function TabIcon({
  focused,
  size = 24,
  customIcon,
  type = "custom",
  name,
  className,
}: TabIconProps) {
  return (
    <View
      className={cn(
        "justify-center items-center h-9 w-14 rounded-2xl",
        focused && "bg-primary shadow-sm",
        className,
      )}
    >
      <Icon
        className={focused ? "text-white" : "text-text-secondary"}
        customIcon={customIcon}
        name={name}
        size={size}
        type={type}
      />
    </View>
  );
}

export default TabIcon;
