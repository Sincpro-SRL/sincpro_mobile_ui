import SectionHeader, {
  type SectionHeaderAction,
} from "@sincpro/mobile-ui/Display/Display.SectionHeader";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Children, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export interface ListGroupProps {
  title: string;
  description?: string;
  footer?: ReactNode;
  action?: SectionHeaderAction;
  children: ReactNode;
  surface?: "inset" | "plain";
  separators?: boolean;
  className?: string;
  contentClassName?: string;
  testID?: string;
}

function ListGroup({
  title,
  description,
  footer,
  action,
  children,
  surface = "inset",
  separators = true,
  className,
  contentClassName,
  testID,
}: ListGroupProps) {
  const rows = Children.toArray(children);

  return (
    <View className={cn("gap-2", className)} testID={testID}>
      <SectionHeader action={action} subtitle={description} title={title} variant="mobile" />
      <View
        className={cn(
          surface === "inset" && "rounded-2xl bg-bg-card overflow-hidden",
          contentClassName,
        )}
        testID={testID ? `${testID}-content` : undefined}
      >
        {rows.map((row, index) => (
          <View key={typeof row === "object" && "key" in row ? row.key : index}>
            {row}
            {separators && index < rows.length - 1 ? (
              <View
                accessibilityElementsHidden
                className="bg-border-default"
                importantForAccessibility="no-hide-descendants"
                style={{
                  height: StyleSheet.hairlineWidth,
                  marginHorizontal: 16,
                }}
                testID={testID ? `${testID}-separator-${index}` : undefined}
              />
            ) : null}
          </View>
        ))}
      </View>
      {typeof footer === "string" ? (
        <Typography.Text className="text-text-secondary px-4" variant="bodyLarge">
          {footer}
        </Typography.Text>
      ) : (
        footer
      )}
    </View>
  );
}

export default ListGroup;
