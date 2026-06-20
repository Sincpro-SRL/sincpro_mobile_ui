import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { FC } from "react";
import { View } from "react-native";

const avatar = tv({
  base: "justify-center items-center rounded-full shadow-sm",
  variants: {
    size: {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-12 h-12",
      xlarge: "w-16 h-16",
    },
    colorScheme: {
      default: "bg-bg-hover",
      primary: "bg-primary/20",
      secondary: "bg-secondary/20",
      success: "bg-success-light",
      warning: "bg-warning-light",
    },
  },
  defaultVariants: {
    size: "medium",
    colorScheme: "default",
  },
});

export interface AvatarProps extends Omit<VariantProps<typeof avatar>, "size"> {
  initials: string;
  size?: number;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ initials, size, colorScheme = "default", className }) => {
  // Map size prop to Tailwind text classes
  const getTextSize = () => {
    if (size && size <= 32) return "text-xs";
    if (size && size <= 40) return "text-sm";
    if (size && size <= 48) return "text-base";
    return "text-lg";
  };

  return (
    <View
      className={cn(avatar({ colorScheme }), className)}
      style={size ? { width: size, height: size } : undefined}
    >
      <Typography.Text
        className={cn("text-text-primary font-semibold", getTextSize())}
        variant="body"
      >
        {initials}
      </Typography.Text>
    </View>
  );
};

export default Avatar;
