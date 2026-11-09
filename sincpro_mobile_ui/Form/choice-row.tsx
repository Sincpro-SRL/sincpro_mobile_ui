import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

const choice = tv({
  slots: {
    row: "flex-row items-center gap-3",
    mark: "w-[18px] h-[18px] rounded-full border-2 items-center justify-center",
    dot: "w-[9px] h-[9px] rounded-full bg-primary",
  },
  variants: {
    look: {
      // Few options, each a bordered card (RadioButton, Select).
      card: { row: "rounded-lg border px-3 bg-bg-card" },
      // Long or virtualized lists (PickerField, EditValue).
      list: { row: "border-b border-border-light py-3" },
    },
    selected: { true: { mark: "border-primary" }, false: { mark: "border-border-default" } },
  },
  compoundVariants: [
    { look: "card", selected: true, className: { row: "border-primary bg-primary/10" } },
    { look: "card", selected: false, className: { row: "border-border-default" } },
  ],
  defaultVariants: { look: "card", selected: false },
});

export interface ChoiceRowProps {
  label: string;
  /** Secondary line, e.g. a client's document number. */
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  look?: "card" | "list";
  testID?: string;
}

/**
 * The single-choice row of the DS: the same radio mark, 48-point target, wrapping label and
 * `radio` semantics on Android and iOS, whether it lists two options or two thousand.
 */
export function ChoiceRow({
  label,
  description,
  selected,
  onPress,
  disabled = false,
  look = "card",
  testID,
}: ChoiceRowProps) {
  const styles = choice({ look, selected });
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected, disabled }}
      className={styles.row()}
      disabled={disabled}
      hitSlop={0}
      onPress={onPress}
      style={{ minHeight: 48 }}
      testID={testID}
    >
      <View className={styles.mark()}>
        {selected ? <View className={styles.dot()} /> : null}
      </View>
      <View className="flex-1 py-2">
        <Typography.Text
          className={disabled ? "text-text-disabled" : "text-text-primary"}
          semibold={selected}
        >
          {label}
        </Typography.Text>
        {description ? (
          <Typography.Text className="text-text-tertiary" variant="bodySmall">
            {description}
          </Typography.Text>
        ) : null}
      </View>
    </Pressable>
  );
}
