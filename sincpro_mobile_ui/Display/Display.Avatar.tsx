import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { fontSizes } from "@sincpro/mobile-ui/theme/typography";
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
      success: "bg-container-success",
      warning: "bg-container-warning",
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
  // Initials grow with the avatar. A className size would lose to the variant, so the
  // size goes to `style` from the type scale.
  const initialsSize =
    size && size <= 32
      ? fontSizes.xs
      : size && size <= 40
        ? fontSizes.sm
        : size && size <= 48
          ? fontSizes.base
          : fontSizes.lg;

  return (
    <View
      className={cn(avatar({ colorScheme }), className)}
      style={size ? { width: size, height: size } : undefined}
    >
      <Typography.Text
        className="text-text-primary"
        semibold
        style={{ fontSize: initialsSize }}
        variant="body"
      >
        {initials}
      </Typography.Text>
    </View>
  );
};

export default Avatar;
