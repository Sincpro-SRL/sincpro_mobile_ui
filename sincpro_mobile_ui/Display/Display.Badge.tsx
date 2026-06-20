import { Text, View } from "react-native";

import { tv, type VariantProps } from "../theme/tw";

const badge = tv({
  slots: {
    root: "px-2.5 py-1.5 rounded-lg self-start",
    text: "text-xs font-semibold",
  },
  variants: {
    variant: {
      info: {
        root: "bg-info-light",
        text: "text-info",
      },
      infoDark: {
        root: "bg-info",
        text: "text-text-on-primary",
      },
      warning: {
        root: "bg-warning-light",
        text: "text-warning",
      },
      success: {
        root: "bg-success-light",
        text: "text-success",
      },
      successDark: {
        root: "bg-success",
        text: "text-text-on-primary",
      },
      danger: {
        root: "bg-danger-light",
        text: "text-danger",
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
}

export type BadgeProps = {
  label: string;
  variant: BadgeVariants | BadgeVariant | string;
  className?: string;
};

function Badge({ label, variant, className }: BadgeProps) {
  const styles = badge({ variant: variant as BadgeVariant });

  return (
    <View className={styles.root({ className })}>
      <Text className={styles.text()} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default Badge;
