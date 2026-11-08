import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

const banner = tv({
  slots: {
    root: "flex-row items-start gap-3 rounded-lg p-3 border",
    title: "text-sm font-semibold",
    message: "text-sm text-text-secondary",
  },
  variants: {
    tone: {
      info: { root: "bg-container-info border-info/30", title: "text-info" },
      success: { root: "bg-container-success border-success/30", title: "text-success" },
      warning: { root: "bg-container-warning border-warning/30", title: "text-warning" },
      danger: { root: "bg-container-danger border-danger/30", title: "text-danger" },
    },
  },
  defaultVariants: { tone: "info" },
});

const iconByTone: Record<NonNullable<BannerProps["tone"]>, IconName> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
};

export interface BannerProps extends VariantProps<typeof banner> {
  message: string;
  title?: string;
  onClose?: () => void;
  action?: ReactNode;
  className?: string;
  testID?: string;
}

function Banner({
  message,
  title,
  tone = "info",
  onClose,
  action,
  className,
  testID,
}: BannerProps) {
  const theme = useTheme();
  const resolvedTone = tone ?? "info";
  const styles = banner({ tone: resolvedTone });

  return (
    <View
      accessibilityLiveRegion={tone === "danger" ? "assertive" : "polite"}
      accessibilityRole={tone === "danger" ? "alert" : undefined}
      className={styles.root({ className })}
      testID={testID}
    >
      <Icon color={theme[resolvedTone]} name={iconByTone[resolvedTone]} size={20} />
      <View className="flex-1 gap-0.5">
        {title ? <Typography.Text className={styles.title()}>{title}</Typography.Text> : null}
        <Typography.Text className={styles.message()}>{message}</Typography.Text>
        {action ? <View className="mt-2">{action}</View> : null}
      </View>
      {onClose ? (
        <Pressable
          accessibilityLabel="Cerrar"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onClose}
        >
          <Icon color={theme.icon.secondary} name="close" size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default Banner;
