import { Display } from "@sincpro/mobile-ui/Display";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { tv } from "tailwind-variants";

const quantitySelector = tv({
  slots: {
    container: "flex-row items-center self-start border border-primary rounded-full px-1",
    button: "w-9 h-9 rounded-full justify-center items-center",
    valueContainer: "min-w-[40px] items-center px-3",
  },
  variants: {
    disabled: {
      true: {
        button: "opacity-50",
      },
    },
  },
});

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}

/** The 36-point step buttons reach a 48-point target without covering the value. */
const STEP_SLOP = { top: 6, bottom: 6, left: 4, right: 4 } as const;
function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  style,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrementStyles = quantitySelector({ disabled: value <= min });
  const incrementStyles = quantitySelector({ disabled: value >= max });
  const containerStyles = quantitySelector();

  return (
    <View className={containerStyles.container()} style={style}>
      <TouchableOpacity
        accessibilityLabel="Disminuir"
        accessibilityRole="button"
        accessibilityState={{ disabled: value <= min }}
        className={decrementStyles.button()}
        disabled={value <= min}
        hitSlop={STEP_SLOP}
        onPress={handleDecrement}
      >
        <Display.Icon name="remove" size={16} />
      </TouchableOpacity>

      <View className={containerStyles.valueContainer()}>
        <Typography.Text semibold variant="body">
          {value}
        </Typography.Text>
      </View>

      <TouchableOpacity
        accessibilityLabel="Aumentar"
        accessibilityRole="button"
        accessibilityState={{ disabled: value >= max }}
        className={incrementStyles.button()}
        disabled={value >= max}
        hitSlop={STEP_SLOP}
        onPress={handleIncrement}
      >
        <Display.Icon name="add" size={16} />
      </TouchableOpacity>
    </View>
  );
}

export default QuantitySelector;
