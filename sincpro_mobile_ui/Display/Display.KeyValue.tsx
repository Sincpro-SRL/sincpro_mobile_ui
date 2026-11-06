import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";

import CopyableText from "./Display.CopyableText";

interface KeyValueLayoutProps {
  label: string;
  align?: "row" | "stacked" | "auto";
  className?: string;
  testID?: string;
  selectable?: boolean;
}

export type KeyValueProps = KeyValueLayoutProps &
  ({ copyable: true; value: string | number } | { copyable?: false; value?: ReactNode });

function KeyValue({
  label,
  value,
  align = "row",
  className,
  testID,
  copyable = false,
  selectable = false,
}: KeyValueProps) {
  const { width, fontScale } = useWindowDimensions();
  const isRow = align === "row" || (align === "auto" && width >= 360 && fontScale <= 1.3);

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
        <View className={cn("flex-shrink min-w-0", isRow && "flex-1 items-end")}>
          {copyable ? (
            <CopyableText
              accessibilityLabel={`Copiar ${label}`}
              selectable={selectable}
              value={String(value)}
            />
          ) : selectable ? (
            <Typography.SelectableText
              className={cn("text-text-primary", isRow && "text-right")}
              semibold={isRow}
              style={{ alignSelf: "stretch" }}
              value={String(value)}
            />
          ) : (
            <Typography.Text
              className={cn("text-text-primary", isRow && "text-right")}
              selectable={selectable}
              semibold={isRow}
            >
              {value}
            </Typography.Text>
          )}
        </View>
      ) : (
        value
      )}
    </View>
  );
}

export default KeyValue;
