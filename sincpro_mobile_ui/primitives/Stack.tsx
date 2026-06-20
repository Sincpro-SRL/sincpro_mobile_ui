import { cn } from "@sincpro/mobile-ui/theme/tw";
import { View, ViewProps } from "react-native";

interface StackProps extends ViewProps {
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

function Stack({ spacing = 4, align = "stretch", className, style, ...props }: StackProps) {
  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <View
      className={cn("flex flex-col", `gap-${spacing}`, alignMap[align], className)}
      style={style}
      {...props}
    />
  );
}

export default Stack;
export { Stack };
