import Badge, { type BadgeVariant } from "@sincpro/mobile-ui/Display/Display.Badge";
import type { IconName } from "@sincpro/mobile-ui/Display/icon-map";

export type StatusTone = NonNullable<BadgeVariant>;

export interface StatusDefinition {
  label: string;
  tone: StatusTone;
  /** For rows that show the state as an icon too. */
  icon?: IconName;
}

export type StatusMap<S extends string> = Readonly<Record<S, StatusDefinition>>;

/**
 * One table per domain state: label, tone and icon stay together, so every
 * badge, row icon and filter chip of that state agrees.
 *
 *   export const INVOICE_STATUS = defineStatuses({
 *     draft: { label: "Borrador", tone: "info" },
 *     paid: { label: "Pagada", tone: "success", icon: "success" },
 *   });
 */
export function defineStatuses<S extends string>(
  map: Record<S, StatusDefinition>,
): StatusMap<S> {
  return Object.freeze({ ...map });
}

const reported = new Set<string>();

/** Unknown states render their raw value with a neutral tone and warn once in dev. */
export function resolveStatus<S extends string>(
  statuses: StatusMap<S>,
  status: S | string | null | undefined,
): StatusDefinition {
  if (status != null && Object.hasOwn(statuses, status)) {
    return statuses[status as S];
  }
  const label = status == null || status === "" ? "—" : String(status);
  if (__DEV__ && !reported.has(label)) {
    reported.add(label);
    console.warn(`[Display.StatusBadge] No definition for status "${label}".`);
  }
  return { label, tone: "info" };
}

export interface StatusBadgeProps<S extends string> {
  status: S | string | null | undefined;
  statuses: StatusMap<S>;
  className?: string;
}

function StatusBadge<S extends string>({ status, statuses, className }: StatusBadgeProps<S>) {
  const definition = resolveStatus(statuses, status);
  return <Badge className={className} label={definition.label} variant={definition.tone} />;
}

export default StatusBadge;
