import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  flex?: number;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  footer?: ReactNode;
  emptyText?: string;
  className?: string;
  testID?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

function cellValue<T>(col: DataTableColumn<T>, row: T): ReactNode {
  if (col.render) return col.render(row);
  const raw = (row as Record<string, unknown>)[col.key];
  return raw == null ? "" : String(raw);
}

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  footer,
  emptyText = "Sin datos",
  className,
  testID,
}: DataTableProps<T>) {
  return (
    <View
      className={cn(
        "bg-bg-card rounded-lg border border-border-light overflow-hidden",
        className,
      )}
      testID={testID}
    >
      <View className="flex-row bg-bg-muted px-3 py-2.5">
        {columns.map((col) => (
          <View key={col.key} style={{ flex: col.flex ?? 1 }}>
            <Typography.Text
              className={cn(
                "text-text-secondary font-semibold",
                alignClass[col.align ?? "left"],
              )}
              numberOfLines={1}
              variant="caption"
            >
              {col.header}
            </Typography.Text>
          </View>
        ))}
      </View>

      {data.length === 0 ? (
        <View className="px-3 py-6 items-center">
          <Typography.Text className="text-text-tertiary" variant="bodySmall">
            {emptyText}
          </Typography.Text>
        </View>
      ) : (
        <ScrollView>
          {data.map((row, index) => (
            <View
              className="flex-row px-3 py-3 border-t border-border-light"
              key={keyExtractor(row, index)}
            >
              {columns.map((col) => {
                const content = cellValue(col, row);
                return (
                  <View key={col.key} style={{ flex: col.flex ?? 1 }}>
                    {typeof content === "string" || typeof content === "number" ? (
                      <Typography.Text
                        className={cn("text-text-primary", alignClass[col.align ?? "left"])}
                        variant="bodySmall"
                      >
                        {content}
                      </Typography.Text>
                    ) : (
                      content
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      {footer ? (
        <View className="flex-row px-3 py-3 border-t border-border-default bg-bg-muted">
          {footer}
        </View>
      ) : null}
    </View>
  );
}

export default DataTable;
