import { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { formatDate, formatDateWithDefaultTimezone } from "@sincpro/mobile-ui/utils/date";
import type { StyleProp, TextStyle } from "react-native";

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

  const formatted = !value
    ? "-"
    : timezone
      ? formatDate(value, timezone, { showTime, locale })
      : formatDateWithDefaultTimezone(value, { showTime, locale });

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
