import type React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { tv } from "tailwind-variants";

import { Display } from "../Display";
import { Typography } from "../Typography";

const quantitySelector = tv({
  slots: {
    container: "flex-row items-center border border-brand-accent rounded-full px-1",
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
        className={decrementStyles.button()}
        disabled={value <= min}
        onPress={handleDecrement}
      >
        <Display.Icon name="minus" size={16} type="feather" />
      </TouchableOpacity>

      <View className={containerStyles.valueContainer()}>
        <Typography.Text semibold variant="body">
          {value}
        </Typography.Text>
      </View>

      <TouchableOpacity
        className={incrementStyles.button()}
        disabled={value >= max}
        onPress={handleIncrement}
      >
        <Display.Icon name="plus" size={16} type="feather" />
      </TouchableOpacity>
    </View>
  );
}

export default QuantitySelector;
