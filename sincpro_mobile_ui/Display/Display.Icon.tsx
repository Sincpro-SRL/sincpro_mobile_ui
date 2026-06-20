import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { theme } from "@sincpro/mobile-ui/theme";
import { IconType } from "@sincpro/mobile-ui/utils/icon";
import { ComponentType, FC } from "react";
import { View } from "react-native";

export interface IconProps {
  name?: any;
  size?: number;
  color?: string;
  type?: IconType;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
  className?: string;
}

const Icon: FC<IconProps> = ({
  name,
  size = 24,
  color,
  type = "ionicons",
  customIcon,
  className,
}) => {
  const iconColor = color || theme.text.primary;

  const renderIcon = () => {
    if (type === "custom" && customIcon) {
      const CustomIconComponent = customIcon;
      return <CustomIconComponent color={iconColor} size={size} />;
    }

    switch (type) {
      case "ionicons":
        return <Ionicons color={iconColor} name={name} size={size} />;
      case "fontawesome":
        return <FontAwesome color={iconColor} name={name} size={size} />;
      case "material":
        return <MaterialIcons color={iconColor} name={name} size={size} />;
      case "fontawesome5":
        return <FontAwesome5 color={iconColor} name={name} size={size} />;
      case "simplelineicons":
        return <SimpleLineIcons color={iconColor} name={name} size={size} />;
      case "antdesign":
        return <AntDesign color={iconColor} name={name} size={size} />;
      case "feather":
        return <Feather color={iconColor} name={name} size={size} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons color={iconColor} name={name} size={size} />;
      default:
        return null;
    }
  };

  return (
    <View className={`justify-center items-center ${className || ""}`}>{renderIcon()}</View>
  );
};

export default Icon;
