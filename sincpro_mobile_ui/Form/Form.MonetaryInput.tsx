import { useTheme } from "@sincpro/mobile-ui/theme";
import { tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { parseToMonetaryNumber } from "@sincpro/mobile-ui/utils/monetary";
import { useState } from "react";
import { View } from "react-native";
import CurrencyInput from "react-native-currency-input";

const monetaryBox = tv({
  base: "justify-center items-center bg-bg-card rounded-lg",
  variants: {
    focused: {
      true: "border-2 border-border-focus",
      false: "border border-border-default",
    },
  },
  defaultVariants: { focused: false },
});

interface MonetaryInputProps {
  amount?: number;
  onChange?: (value: number) => void;
  currencySymbol?: string;
  placeholder?: string;
}

function MonetaryInput({
  amount,
  onChange,
  currencySymbol = "₡",
  placeholder = "Escriba el monto",
}: MonetaryInputProps) {
  const theme = useTheme();
  const [raw, setRaw] = useState<number>(parseToMonetaryNumber(amount));
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (amount: number) => {
    setRaw(amount);
    onChange?.(parseToMonetaryNumber(amount));
  };

  return (
    <View className="flex-row">
      <View className={monetaryBox({ focused: isFocused, className: "w-10 h-10" })}>
        <Typography.Text className="text-xl" variant="body">
          {currencySymbol}
        </Typography.Text>
      </View>
      <View
        className={monetaryBox({ focused: isFocused, className: "flex-1 h-10 ml-2 px-4" })}
      >
        <CurrencyInput
          delimiter="."
          keyboardType="numeric"
          onBlur={() => setIsFocused(false)}
          onChangeValue={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          selectionColor={theme.primary}
          separator=","
          underlineColorAndroid="transparent"
          value={raw}
        />
      </View>
    </View>
  );
}

export default MonetaryInput;
