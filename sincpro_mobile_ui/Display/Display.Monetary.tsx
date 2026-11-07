import { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { formatTwoDecimals } from "@sincpro/mobile-ui/utils/monetary";
import type { StyleProp, TextStyle } from "react-native";

interface MonetaryFieldProps {
  value: number | string | null | undefined;
  currencySymbol?: string;
  prefix?: string;
  textVariant?: keyof typeof typographyVariants;
  style?: StyleProp<TextStyle>;
  symbolStyle?: StyleProp<TextStyle>;
  semibold?: boolean;
  bold?: boolean;
  className?: string;
}

function MonetaryField({
  value,
  currencySymbol = "₡",
  prefix = "",
  textVariant = "data",
  style = {},
  symbolStyle,
  semibold = true,
  bold = false,
  className,
}: MonetaryFieldProps) {
  const isEmptyValue = value === null || value === undefined || value === "";
  const formatted = isEmptyValue ? "0.00" : formatTwoDecimals(value);

  return (
    <Typography.Text
      bold={bold}
      className={className}
      semibold={semibold && !bold}
      style={style}
      variant={textVariant}
    >
      <Typography.Text
        className={className}
        style={[style, symbolStyle]}
        variant={textVariant}
      >
        {currencySymbol}
      </Typography.Text>{" "}
      {prefix && `${prefix} `}
      {formatted}
    </Typography.Text>
  );
}

export default MonetaryField;
