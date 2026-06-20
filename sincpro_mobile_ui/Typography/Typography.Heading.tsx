import type React from "react";
import { FC } from "react";
import type { TextProps } from "react-native";

import { typographyVariants } from "../theme/typography";
import { AppText } from "./Typography.Text";

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
