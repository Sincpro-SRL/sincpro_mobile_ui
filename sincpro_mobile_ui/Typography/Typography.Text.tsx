import { cn } from "@sincpro/mobile-ui/theme/tw";
import {
  resolveTextFontFamily,
  Typography,
  typographyVariants,
} from "@sincpro/mobile-ui/theme/typography";
import type React from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

/**
 * Typography.Text - Hybrid component (NativeWind + Style)
 *
 * Uses NativeWind className for: spacing, colors, transforms, alignment
 * Uses style prop for: typography variants (fontFamily, fontSize, lineHeight)
 *
 * Reason: Custom fonts (Montserrat) not in Tailwind, complex typography system
 *
 * @deprecated color prop - Use className instead: e.g. className="text-text-primary" or className="text-text-accent"
 */
interface AppTextProps extends TextProps {
  variant?: keyof typeof typographyVariants;
  /** @deprecated Use className="text-{color}" instead */
  color?: string;
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
  color,
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
  const baseStyle = Typography.variants[variant];

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
    ...baseStyle,
    ...(color ? { color } : {}),
    fontFamily: resolveTextFontFamily(variant, bold, semibold),
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
