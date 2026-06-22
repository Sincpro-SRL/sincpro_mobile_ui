import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { formatDate, formatDateWithDefaultTimezone } from "@sincpro/mobile-ui/utils/date";
import { type StyleProp, type TextStyle, View } from "react-native";

type DateFormat = "short" | "long" | "numeric";

/**
 * Visual layout:
 * - `inline` (default): plain text, backward-compatible with previous usage.
 * - `withIcon`: leading calendar/clock icon + text — the app-like default.
 * - `pill`: tokenized rounded chip with icon (compact metadata).
 */
type DateVariant = "inline" | "withIcon" | "pill";

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
  /** App-like layout. Default `inline` (no visual change vs. previous version). */
  variant?: DateVariant;
  /** Override the leading icon (ionicons). Defaults: calendar, or clock if `showTime`. */
  icon?: string;
  /** Show relative time ("hace 2 h") instead of the absolute date. */
  relative?: boolean;
}

function relativeTime(value: string | Date): string {
  const then = new Date(value).getTime();
  const diffSec = Math.round((Date.now() - then) / 1000);
  const abs = Math.abs(diffSec);
  const fut = diffSec < 0;
  const fmt = (n: number, unit: string) => (fut ? `en ${n} ${unit}` : `hace ${n} ${unit}`);
  if (abs < 60) return "ahora";
  if (abs < 3600) return fmt(Math.floor(abs / 60), "min");
  if (abs < 86400) return fmt(Math.floor(abs / 3600), "h");
  if (abs < 604800) return fmt(Math.floor(abs / 86400), "d");
  return fmt(Math.floor(abs / 604800), "sem");
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
  variant = "inline",
  icon,
  relative = false,
}: DateFieldProps) {
  const locale = "es-CR";

  const absolute = !value
    ? "-"
    : timezone
      ? formatDate(value, timezone, { showTime, locale })
      : formatDateWithDefaultTimezone(value, { showTime, locale });

  const formatted = value && relative ? relativeTime(value) : absolute;
  const text = prefix ? `${prefix}${formatted}` : formatted;
  const iconName = icon ?? (showTime && !relative ? "time-outline" : "calendar-outline");

  const label = (
    <Typography.Text
      bold={bold}
      color={color}
      semibold={semibold && !bold}
      style={style as TextStyle}
      variant={textVariant}
    >
      {text}
    </Typography.Text>
  );

  if (variant === "inline") {
    return (
      <Typography.Text
        bold={bold}
        className={className}
        color={color}
        semibold={semibold && !bold}
        style={style as TextStyle}
        variant={textVariant}
      >
        {text}
      </Typography.Text>
    );
  }

  if (variant === "pill") {
    return (
      <View
        className={cn(
          "flex-row items-center self-start gap-1.5 rounded-full bg-bg-muted px-2.5 py-1",
          className,
        )}
      >
        <Icon color={color ?? theme.icon.secondary} name={iconName} size={14} />
        {label}
      </View>
    );
  }

  return (
    <View className={cn("flex-row items-center gap-1.5", className)}>
      <Icon color={color ?? theme.icon.secondary} name={iconName} size={16} />
      {label}
    </View>
  );
}

export default DateField;
