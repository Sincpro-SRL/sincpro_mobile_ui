import { cn, tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { View } from "react-native";

// The divider names border tokens of the preset (its old color token did not exist and it
// drew nothing). `default` is the line between list rows.
const divider = tv({
  base: "w-full bg-border-default",
  variants: {
    spacing: {
      none: "my-0",
      sm: "my-1",
      md: "my-2",
      lg: "my-3",
    },
    colorScheme: {
      light: "bg-border-light",
      default: "bg-border-default",
      dark: "bg-border-strong",
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
