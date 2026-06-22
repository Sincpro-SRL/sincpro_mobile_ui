import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

const card = tv({
  base: "bg-bg-card rounded-lg border border-border-light",
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

export interface CardProps extends VariantProps<typeof card> {
  elevation?: "none" | "sm" | "md" | "lg";
  onPress?: () => void;
  className?: string;
  children?: ReactNode;
  testID?: string;
}

function Card({
  padding = "md",
  elevation = "sm",
  onPress,
  className,
  children,
  testID,
}: CardProps) {
  const shadow = elevation === "none" ? undefined : theme.shadow[elevation];

  if (onPress) {
    return (
      <Pressable
        className={card({ padding, className })}
        onPress={onPress}
        style={shadow}
        testID={testID}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={card({ padding, className })} style={shadow} testID={testID}>
      {children}
    </View>
  );
}

function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Typography.Text
      className={cn("text-text-primary mb-1", className)}
      semibold
      variant="h4"
    >
      {children}
    </Typography.Text>
  );
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <View className={cn("flex-row items-center justify-end gap-2 mt-3", className)}>
      {children}
    </View>
  );
}

const CardWithSlots = Object.assign(Card, { Title: CardTitle, Footer: CardFooter });

export default CardWithSlots;
export { CardWithSlots as Card };
