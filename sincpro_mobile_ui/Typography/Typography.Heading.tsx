import { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { AppText } from "@sincpro/mobile-ui/Typography/Typography.Text";
import type React from "react";
import { FC } from "react";
import type { TextProps } from "react-native";

export interface TypographyProps extends TextProps {
  variant?: keyof typeof typographyVariants;
  color?: string;
  bold?: boolean;
  semibold?: boolean;
  underline?: boolean;
}

const Heading: FC<TypographyProps> = ({ variant = "h1", ...props }) => {
  return <AppText variant={variant} {...props} />;
};

export default Heading;
