import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getLocales } from "expo-localization";

const DEFAULT_TIMEZONE = "America/Costa_Rica";
const DEFAULT_LOCALE = "es-CR";

dayjs.extend(utc);
dayjs.extend(timezone);

interface FormatDateOptions {
  locale?: string | null;
  showTime?: boolean; // If omitted, auto-detected based on whether the input carries a time
}

/**
 * Formats a date in the given timezone, respecting the granularity of the input.
 *
 * Detection rules:
 * 1. If `input` is a 'YYYY-MM-DD' string (date only) => interpreted as midnight (00:00:00)
 *    in the target timezone and ONLY the date part is returned (no time).
 * 2. If `input` includes a time component (full ISO or Date) => converted to the target timezone
 *    and shown as date + time (HH:MM) unless overridden via `options.showTime`.
 * 3. When `options.showTime` is `true` or `false` it overrides the auto-detection.
 * 4. If `timezone` is null/undefined or invalid, the string "Error de formateo" is returned.
 *
 * Localization:
 * - Uses the device's first locale (`expo-localization`) by default.
 * - You can force a different one with `options.locale` (e.g. 'es-CR', 'en-US').
 *
 * Timezone safety:
 * - A date without time is NOT parsed in the device's local zone and then converted,
 *   but directly in the target zone to avoid day shifts.
 *
 * Examples:
 * ```ts
 * formatDate('2025-09-02', 'America/Costa_Rica');
 * // => "2 de septiembre de 2025"
 *
 * formatDate('2025-09-02T18:30:00Z', 'America/Costa_Rica');
 * // => "2 de septiembre de 2025, 12:30 p. m." (dependiendo del locale real)
 *
 * formatDate(new Date('2025-09-02T23:15:00Z'), 'Europe/Madrid');
 * // => "3 de septiembre de 2025, 01:15" (day shifts due to +02 zone)
 *
 * formatDate('2025-09-02', 'America/Costa_Rica', { showTime: true });
 * // => "2 de septiembre de 2025, 12:00 a. m." (fuerza hora)
 * ```
 *
 * @param input      Date (ISO string, 'YYYY-MM-DD', or Date instance)
 * @param timezone   IANA timezone (e.g. 'America/Costa_Rica', 'Asia/Tokyo'). Falls back to Costa Rica if null/undefined
 * @param options    Optional: forced locale and/or flag to show the time
 * @returns          Localized string, or "Error de formateo" if it can't be processed
 */
export function formatDate(
  input: string | Date,
  timezone: string | null | undefined,
  options?: FormatDateOptions,
): string {
  // Use the default timezone when none is provided
  const effectiveTimezone = timezone || DEFAULT_TIMEZONE;

  const fallbackLocale = DEFAULT_LOCALE.split("-")[0]; // "es" from "es-CR"
  const deviceLocale = getLocales()?.[0]?.languageTag ?? fallbackLocale;
  const usedLocale = options?.locale ?? deviceLocale;

  try {
    const rawStr = typeof input === "string" ? input : input.toISOString();
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(rawStr);

    // Auto-detect showTime when not passed explicitly
    const effectiveShowTime =
      options?.showTime !== undefined
        ? options.showTime
        : !isDateOnly && /T\d{2}:\d{2}/.test(rawStr); // has a time component

    const dateInstance = isDateOnly
      ? dayjs.tz(`${rawStr}T00:00:00`, effectiveTimezone)
      : dayjs.utc(rawStr).tz(effectiveTimezone);
    const dateInZone = dateInstance.toDate();

    const formatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: effectiveTimezone,
    };

    if (effectiveShowTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
    }

    return new Intl.DateTimeFormat(usedLocale, formatOptions).format(dateInZone);
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "Error de formateo";
  }
}

/**
 * Formats a date using the default timezone automatically (Costa Rica).
 * Useful when the user's timezone isn't available.
 *
 * @param input      Date (ISO string, 'YYYY-MM-DD', or Date instance)
 * @param options    Optional: forced locale and/or flag to show the time
 * @returns          Localized string in the Costa Rica timezone
 */
export function formatDateWithDefaultTimezone(
  input: string | Date,
  options?: FormatDateOptions,
): string {
  return formatDate(input, DEFAULT_TIMEZONE, options);
}

/**
 * Returns the current date as YYYY-MM-DD in the given timezone.
 * Useful to build scheduling dates that respect the user's timezone.
 *
 * @param timezone IANA timezone. Falls back to Costa Rica if null/undefined
 * @returns Current date as YYYY-MM-DD in the given timezone
 */
export function getCurrentDateInTimezone(timezone?: string | null): string {
  const effectiveTimezone = timezone || DEFAULT_TIMEZONE;
  try {
    return dayjs().tz(effectiveTimezone).format("YYYY-MM-DD");
  } catch (error) {
    console.warn("Error getting current date in timezone:", error);
    return dayjs().format("YYYY-MM-DD"); // Fallback to local
  }
}

/**
 * Returns the current date-time as an ISO string in the given timezone.
 * Useful for timestamps that need to reflect the user's timezone.
 *
 * @param timezone IANA timezone. Falls back to Costa Rica if null/undefined
 * @returns Current date-time as an ISO string in the given timezone
 */
export function getCurrentDateTimeInTimezone(timezone?: string | null): string {
  const effectiveTimezone = timezone || DEFAULT_TIMEZONE;
  try {
    return dayjs().tz(effectiveTimezone).toISOString();
  } catch (error) {
    console.warn("Error getting current date-time in timezone:", error);
    return dayjs().toISOString(); // Fallback to local
  }
}
