import { fontSizes } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

const metrics = StyleSheet.create({
  label: { fontSize: fontSizes.xs, lineHeight: 16 },
});

export interface PillLabelProps {
  children: ReactNode;
  /** Ink of the pill, e.g. `text-success`. */
  className: string;
  /** Status pills (`Badge`) are semibold; chips and tags are medium. */
  semibold?: boolean;
}

/**
 * The label every pill of the DS shares (badges, chips, tags): one size, one line,
 * and the configured DS font instead of a className font that the app never loads.
 */
export function PillLabel({ children, className, semibold = false }: PillLabelProps) {
  return (
    <Typography.Text
      className={className}
      numberOfLines={1}
      semibold={semibold}
      style={metrics.label}
      variant="labelSmall"
    >
      {children}
    </Typography.Text>
  );
}
