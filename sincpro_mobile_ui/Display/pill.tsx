import type { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

const metrics = StyleSheet.create({
  // 12 reads at a glance and keeps the pill 28 points tall (16 line height + padding).
  label: { fontSize: 12, lineHeight: 16 },
});

export interface PillLabelProps {
  children: ReactNode;
  /** Ink of the pill, e.g. `text-success`. */
  className: string;
  /** Status pills (`Badge`) are semibold; chips and tags are medium. */
  semibold?: boolean;
  /** A typography variant instead of the pill metrics, e.g. `caption` for denser lists. */
  variant?: keyof typeof typographyVariants;
}

/**
 * The label every pill of the DS shares (badges, chips, tags): one size, one line,
 * and the configured DS font instead of a className font that the app never loads.
 */
export function PillLabel({
  children,
  className,
  semibold = false,
  variant,
}: PillLabelProps) {
  return (
    <Typography.Text
      className={className}
      numberOfLines={1}
      semibold={semibold}
      style={variant ? undefined : metrics.label}
      variant={variant ?? "labelSmall"}
    >
      {children}
    </Typography.Text>
  );
}
