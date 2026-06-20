import { cn } from "@sincpro/mobile-ui/theme/tw";
import { View, ViewProps } from "react-native";

interface RowProps extends ViewProps {
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  className?: string;
}

function Row({
  spacing = 2,
  align = "center",
  justify = "start",
  wrap = false,
  className,
  style,
  ...props
}: RowProps) {
  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <View
      className={cn(
        "flex flex-row",
        `gap-${spacing}`,
        alignMap[align],
        justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

export default Row;
export { Row };
