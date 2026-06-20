import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { View } from "react-native";

const divider = tv({
  base: "w-full bg-border-divider",
  variants: {
    spacing: {
      none: "my-0",
      sm: "my-1",
      md: "my-2",
      lg: "my-3",
    },
    colorScheme: {
      light: "bg-border-divider opacity-50",
      default: "bg-border-divider",
      dark: "bg-border-divider opacity-100",
    },
  },
  defaultVariants: {
    spacing: "md",
    colorScheme: "default",
  },
});

interface DividerProps extends VariantProps<typeof divider> {
  thickness?: number;
  className?: string;
}

function Divider({ thickness = 1, spacing, colorScheme, className }: DividerProps) {
  return (
    <View
      className={cn(divider({ spacing, colorScheme }), className)}
      style={{ height: thickness }}
    />
  );
}

export default Divider;
