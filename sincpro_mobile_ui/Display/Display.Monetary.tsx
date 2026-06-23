import { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { formatTwoDecimals } from "@sincpro/mobile-ui/utils/monetary";
import type { StyleProp, TextStyle } from "react-native";

interface MonetaryFieldProps {
  value: number | string | null | undefined;
  currencySymbol?: string;
  prefix?: string;
  /** @deprecated Use className="text-{color}" instead */
  color?: string;
  textVariant?: keyof typeof typographyVariants;
  /** @deprecated Use className for styling */
  style?: StyleProp<TextStyle>;
  /** @deprecated Use className="text-{color}" instead */
  symbolColor?: string;
  semibold?: boolean;
  bold?: boolean;
  className?: string;
}

function MonetaryField({
  value,
  currencySymbol = "₡",
  prefix = "",
  color,
  textVariant = "data",
  style = {},
  symbolColor,
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
      color={color}
      semibold={semibold && !bold}
      style={style as any}
      variant={textVariant}
    >
      <Typography.Text
        className={className}
        color={symbolColor || color}
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
