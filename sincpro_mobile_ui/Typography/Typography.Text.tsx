import { cn } from "@sincpro/mobile-ui/theme/tw";
import {
  fontFamilies,
  Typography,
  typographyVariants,
  variantFontRole,
} from "@sincpro/mobile-ui/theme/typography";
import type React from "react";
import { Text, type TextProps, type TextStyle } from "react-native";

/**
 * Typography.Text - Hybrid component (NativeWind + Style)
 *
 * Uses NativeWind className for: spacing, colors, transforms, alignment
 * Uses style prop for: typography variants (fontFamily, fontSize, lineHeight)
 *
 * Reason: Custom fonts (Montserrat) not in Tailwind, complex typography system
 *
 * @deprecated color prop - Use className instead: className="text-primary" or className="text-text-secondary"
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

  // Resolve the family LIVE from the configurable registry by the variant's role, so
  // `configureFonts(...)` (app/Storybook) takes effect. Falls back to the variant's baked
  // family if a role is somehow missing.
  const variantFamily = fontFamilies[variantFontRole[variant]] ?? baseStyle.fontFamily;
  // `bold`/`semibold` map to the Inter weights — but NOT when the active family is a branded
  // face (a configured title face, or Fira Code mono): those carry their own weight, so
  // forcing Inter would erase the typeface. Keep the variant's family for those.
  const isBrandedFace =
    typeof variantFamily === "string" && !variantFamily.startsWith("Inter_");

  const textStyle: TextStyle = {
    ...baseStyle,
    ...(color ? { color } : {}),
    fontFamily: isBrandedFace
      ? variantFamily
      : bold
        ? fontFamilies.extraBold
        : semibold
          ? fontFamilies.semiBold
          : variantFamily,
    ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
  };

  return (
    <Text className={textClassName} style={textStyle} {...props}>
      {children}
    </Text>
  );
}

export default AppText;
export { AppText };
