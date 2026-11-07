import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { uniqueKeys } from "@sincpro/mobile-ui/utils/keys";
import { type ComponentProps, type ReactNode, useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export interface ErrorSummaryItem {
  readonly id: string;
  readonly label: string;
  readonly message: string;
}

export interface ErrorSummaryProps extends Omit<ViewProps, "children"> {
  errors: readonly ErrorSummaryItem[];
  onSelectError: (id: string) => void;
  title?: string;
  announce?: boolean;
  className?: string;
  itemStyle?: StyleProp<ViewStyle>;
  /** Custom content must preserve the message and remain scalable, multiline and non-interactive. */
  renderErrorContent?: (error: ErrorSummaryItem, index: number) => ReactNode;
  /** Custom content must remain scalable and multiline; the wrapper owns header semantics. */
  renderHeader?: (title: string) => ReactNode;
  itemTextProps?: Omit<
    ComponentProps<typeof Typography.Text>,
    "children" | "accessibilityRole" | "allowFontScaling" | "numberOfLines"
  >;
  titleTextProps?: Omit<
    ComponentProps<typeof Typography.Text>,
    "children" | "accessibilityRole" | "allowFontScaling" | "numberOfLines"
  >;
}

export default function ErrorSummary({
  errors,
  onSelectError,
  title = "Revisa los siguientes errores",
  announce = true,
  className,
  style,
  itemStyle,
  renderErrorContent,
  renderHeader,
  itemTextProps,
  titleTextProps,
  ...props
}: ErrorSummaryProps) {
  const theme = useTheme();
  const nonemptyEpisode = useRef(false);
  uniqueKeys(errors, (error) => error.id, "ErrorSummary");
  for (const { label, message } of errors) {
    if (typeof label !== "string" || !label.trim())
      throw new Error("Form.ErrorSummary requires non-empty error labels.");
    if (typeof message !== "string" || !message.trim())
      throw new Error("Form.ErrorSummary requires non-empty error messages.");
  }
  useEffect(() => {
    if (errors.length === 0) {
      nonemptyEpisode.current = false;
      return;
    }
    if (nonemptyEpisode.current) return;
    nonemptyEpisode.current = true;
    if (announce)
      AccessibilityInfo.announceForAccessibility(
        [title, ...errors.map(({ label, message }) => `${label}: ${message}`)].join("\n"),
      );
  }, [announce, errors, title]);
  if (errors.length === 0) return null;
  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: theme.bg.card,
          borderColor: theme.danger,
          borderWidth: 2,
          borderRadius: 8,
          padding: 16,
          gap: 8,
        },
        style,
      ]}
      {...props}
    >
      {renderHeader ? (
        <View accessibilityLabel={title} accessibilityRole="header" accessible>
          {renderHeader(title)}
        </View>
      ) : (
        <Typography.Text
          semibold
          variant="body"
          {...titleTextProps}
          accessibilityRole="header"
          allowFontScaling
          numberOfLines={0}
        >
          {title}
        </Typography.Text>
      )}
      {errors.map((error, index) => (
        <Pressable
          accessibilityLabel={`${error.label}: ${error.message}`}
          accessibilityRole="button"
          accessible
          hitSlop={0}
          key={error.id}
          onPress={() => onSelectError(error.id)}
          style={[styles.item, itemStyle, styles.target]}
        >
          {renderErrorContent ? (
            renderErrorContent(error, index)
          ) : (
            <>
              <Typography.Text
                semibold
                variant="bodySmall"
                {...itemTextProps}
                allowFontScaling
                numberOfLines={0}
              >
                {error.label}
              </Typography.Text>
              <Typography.Text
                className="text-text-accent"
                underline
                {...itemTextProps}
                allowFontScaling
                numberOfLines={0}
              >
                {error.message}
              </Typography.Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  target: {
    minHeight: 48,
    minWidth: 48,
  },
});
