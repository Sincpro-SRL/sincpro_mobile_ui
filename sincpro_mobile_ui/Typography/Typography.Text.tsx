import { cn } from "@sincpro/mobile-ui/theme/tw";
import { appliedTextStyle, typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import type React from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

/**
 * Typography.Text - Hybrid component (NativeWind + Style)
 *
 * Uses NativeWind className for: spacing, colors, transforms, alignment
 * Uses style prop for: typography variants (fontFamily, fontSize, lineHeight)
 *
 */
interface AppTextProps extends TextProps {
  variant?: keyof typeof typographyVariants;
  bold?: boolean;
  semibold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right" | "justify";
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  className?: string;
}

function AppText({
  variant = "body",
  bold = false,
  italic = false,
  underline = false,
  align = "left",
  transform = "none",
  semibold = false,
  style,
  className,
  children,
  ...props
}: AppTextProps) {
  const textClassName = cn(
    "text-text-primary",
    align === "center" && "text-center",
    align === "right" && "text-right",
    align === "justify" && "text-justify",
    transform === "uppercase" && "uppercase",
    transform === "lowercase" && "lowercase",
    transform === "capitalize" && "capitalize",
    underline && "underline",
    italic && "italic",
    className,
  );

  const textStyle: TextStyle = {
    ...appliedTextStyle(variant, bold, semibold),
    ...StyleSheet.flatten(style),
  };

  return (
    <Text className={textClassName} style={textStyle} {...props}>
      {children}
    </Text>
  );
}

export default AppText;
export { AppText };
