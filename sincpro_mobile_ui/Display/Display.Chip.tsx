import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv, type VariantProps } from "@sincpro/mobile-ui/theme/tw";
import { Text, View } from "react-native";

const chip = tv({
  slots: {
    root: "flex-row items-center self-start rounded-full px-3 py-1.5 gap-1",
    label: "text-xs font-medium",
  },
  variants: {
    tone: {
      neutral: { root: "bg-bg-muted", label: "text-text-secondary" },
      primary: { root: "bg-bg-accent", label: "text-text-accent" },
      success: { root: "bg-success-light", label: "text-success" },
      warning: { root: "bg-warning-light", label: "text-warning" },
      danger: { root: "bg-danger-light", label: "text-danger" },
    },
    selected: {
      true: { root: "border border-primary" },
    },
  },
  defaultVariants: {
    tone: "neutral",
    selected: false,
  },
});

const removeIconColor: Record<string, string> = {
  neutral: theme.text.secondary,
  primary: theme.text.accent,
  success: theme.success,
  warning: theme.warning,
  danger: theme.danger,
};

export interface ChipProps extends VariantProps<typeof chip> {
  label: string;
  onPress?: () => void;
  onRemove?: () => void;
  className?: string;
  testID?: string;
}

function Chip({
  label,
  tone = "neutral",
  selected = false,
  onPress,
  onRemove,
  className,
  testID,
}: ChipProps) {
  const styles = chip({ tone, selected });
  const content = (
    <>
      <Text className={styles.label()} numberOfLines={1}>
        {label}
      </Text>
      {onRemove ? (
        <Pressable accessibilityLabel={`Quitar ${label}`} hitSlop={8} onPress={onRemove}>
          <Icon color={removeIconColor[tone ?? "neutral"]} name="close" size={14} />
        </Pressable>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        className={styles.root({ className })}
        onPress={onPress}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={styles.root({ className })} testID={testID}>
      {content}
    </View>
  );
}

export default Chip;
export { Chip };
