import { PillLabel } from "@sincpro/mobile-ui/Display/pill";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import type { typographyVariants } from "@sincpro/mobile-ui/theme/typography";
import { View } from "react-native";

const badge = tv({
  slots: {
    root: "px-2.5 py-1.5 rounded-lg self-start",
    text: "",
  },
  variants: {
    variant: {
      info: {
        root: "bg-container-info",
        text: "text-info",
      },
      infoDark: {
        root: "bg-info",
        text: "text-text-on-primary",
      },
      warning: {
        root: "bg-container-warning",
        text: "text-warning",
      },
      success: {
        root: "bg-container-success",
        text: "text-success",
      },
      successDark: {
        root: "bg-success",
        text: "text-text-on-primary",
      },
      danger: {
        root: "bg-container-danger",
        text: "text-danger",
      },
      accent: {
        root: "bg-accent",
        text: "text-text-on-accent",
      },
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export type BadgeVariant = VariantProps<typeof badge>["variant"];

export enum BadgeVariants {
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
  INFO_DARK = "infoDark",
  DANGER = "danger",
  SUCCESS_DARK = "successDark",
  ACCENT = "accent",
}

export type BadgeProps = {
  label: string;
  variant: BadgeVariants | BadgeVariant | string;
  className?: string;
  /** Typography variant of the label. Defaults to the shared pill metrics (12/16). */
  textVariant?: keyof typeof typographyVariants;
};

function Badge({ label, variant, className, textVariant }: BadgeProps) {
  const styles = badge({ variant: variant as BadgeVariant });

  return (
    <View className={styles.root({ className })}>
      <PillLabel className={styles.text()} semibold variant={textVariant}>
        {label}
      </PillLabel>
    </View>
  );
}

export default Badge;
