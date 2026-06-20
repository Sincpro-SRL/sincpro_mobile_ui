import type { StyleProp, TextStyle } from "react-native";

import { formatDate } from "../lib/date";
import { typographyVariants } from "../theme/typography";
import { Typography } from "../Typography";

type DateFormat = "short" | "long" | "numeric";

interface DateFieldProps {
  value: string | Date | null | undefined;
  format?: DateFormat;
  prefix?: string;
  textVariant?: keyof typeof typographyVariants;
  color?: string;
  style?: StyleProp<TextStyle>;
  semibold?: boolean;
  bold?: boolean;
  className?: string;
  showTime?: boolean;
  timezone?: string;
}

function DateField({
  value,
  format = "short",
  prefix = "",
  textVariant = "body",
  color,
  style = {},
  semibold = false,
  bold = false,
  className,
  showTime = true,
  timezone,
}: DateFieldProps) {
  const locale = "es-CR";

  const formatted = value
    ? formatDate(value, timezone, {
        showTime,
        locale,
      })
    : "-";

  return (
    <Typography.Text
      bold={bold}
      className={className}
      color={color}
      semibold={semibold && !bold}
      style={style as any}
      variant={textVariant}
    >
      {prefix ? `${prefix}${formatted}` : formatted}
    </Typography.Text>
  );
}

export default DateField;
