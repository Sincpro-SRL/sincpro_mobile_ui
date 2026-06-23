import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface KeyValueProps {
  label: string;
  value?: ReactNode;
  align?: "row" | "stacked";
  className?: string;
  testID?: string;
}

function KeyValue({ label, value, align = "row", className, testID }: KeyValueProps) {
  const isRow = align === "row";

  return (
    <View
      className={cn(
        isRow ? "flex-row items-center justify-between gap-3" : "gap-0.5",
        "py-2",
        className,
      )}
      testID={testID}
    >
      <Typography.Text className="text-text-secondary" variant="caption">
        {label}
      </Typography.Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography.Text
          className={cn("text-text-primary", isRow && "text-right")}
          semibold={isRow}
        >
          {value}
        </Typography.Text>
      ) : (
        value
      )}
    </View>
  );
}

export default KeyValue;
