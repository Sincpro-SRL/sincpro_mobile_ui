import SectionHeader, {
  type SectionHeaderAction,
  type SectionHeaderProps,
} from "@sincpro/mobile-ui/Display/Display.SectionHeader";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Children, type ComponentProps, type ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

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
  headerProps?: Omit<SectionHeaderProps, "title" | "subtitle" | "action">;
  footerTextProps?: Omit<ComponentProps<typeof Typography.Text>, "children">;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
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
  headerProps,
  footerTextProps,
  style,
  contentStyle,
  separatorStyle,
}: ListGroupProps) {
  const rows = Children.toArray(children);

  return (
    <View className={cn("gap-2", className)} style={style} testID={testID}>
      <SectionHeader {...headerProps} action={action} subtitle={description} title={title} />
      <View
        className={cn(
          surface === "inset" && "rounded-2xl bg-bg-card overflow-hidden",
          contentClassName,
        )}
        style={contentStyle}
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
                style={[
                  {
                    height: StyleSheet.hairlineWidth,
                    marginHorizontal: 16,
                  },
                  separatorStyle,
                ]}
                testID={testID ? `${testID}-separator-${index}` : undefined}
              />
            ) : null}
          </View>
        ))}
      </View>
      {typeof footer === "string" ? (
        <Typography.Text
          className="text-text-secondary px-4"
          variant="bodySmall"
          {...footerTextProps}
        >
          {footer}
        </Typography.Text>
      ) : (
        footer
      )}
    </View>
  );
}

export default ListGroup;
