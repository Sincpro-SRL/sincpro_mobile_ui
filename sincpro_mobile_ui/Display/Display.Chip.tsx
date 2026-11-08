import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { type ThemeTokens, useTheme } from "@sincpro/mobile-ui/theme";
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
      primary: { root: "bg-container-primary", label: "text-container-on-primary" },
      success: { root: "bg-container-success", label: "text-container-on-success" },
      warning: { root: "bg-container-warning", label: "text-container-on-warning" },
      danger: { root: "bg-container-danger", label: "text-container-on-danger" },
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

function removeIconColor(theme: ThemeTokens): Record<string, string> {
  return {
    neutral: theme.text.secondary,
    primary: theme.container.onPrimary,
    success: theme.container.onSuccess,
    warning: theme.container.onWarning,
    danger: theme.container.onDanger,
  };
}

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
  const theme = useTheme();
  const styles = chip({ tone, selected });
  const content = (
    <>
      <Text className={styles.label()} numberOfLines={1}>
        {label}
      </Text>
      {onRemove ? (
        <Pressable accessibilityLabel={`Quitar ${label}`} hitSlop={8} onPress={onRemove}>
          <Icon color={removeIconColor(theme)[tone ?? "neutral"]} name="close" size={14} />
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
