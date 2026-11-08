import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { appliedTextStyle, typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import type React from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

/**
 * Typography.Text - Hybrid component (NativeWind + Style)
 *
 * Uses style prop for: typography variants (fontFamily, fontSize, lineHeight)
 * Without `className` it renders through a plain StyleSheet path: the theme
 * color and the modifiers go to `style`, so the most repeated component of the
 * app never pays for class merging or the NativeWind interop. With `className`
 * it keeps the class contract (spacing, colors, transforms, alignment).
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

const modifiers = StyleSheet.create({
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  justify: { textAlign: "justify" },
  uppercase: { textTransform: "uppercase" },
  lowercase: { textTransform: "lowercase" },
  capitalize: { textTransform: "capitalize" },
  underline: { textDecorationLine: "underline" },
  italic: { fontStyle: "italic" },
});

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
  const theme = useTheme();
  const variantStyle = appliedTextStyle(variant, bold, semibold);

  if (className) {
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
    const textStyle: TextStyle = { ...variantStyle, ...StyleSheet.flatten(style) };
    return (
      <Text className={textClassName} style={textStyle} {...props}>
        {children}
      </Text>
    );
  }

  return (
    <Text
      style={[
        variantStyle,
        { color: theme.text.primary },
        align !== "left" && modifiers[align],
        transform !== "none" && modifiers[transform],
        underline && modifiers.underline,
        italic && modifiers.italic,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

export default AppText;
export { AppText };
