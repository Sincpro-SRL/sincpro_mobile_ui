import { Dialog, type EditableValueModalChip } from "@sincpro/mobile-ui/Dialog";
import { Display } from "@sincpro/mobile-ui/Display";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { normalizeQuantity, roundTo } from "@sincpro/mobile-ui/utils/quantity";
import { useCallback, useMemo, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { tv } from "tailwind-variants";

const fractionalQuantityInput = tv({
  slots: {
    container: "flex-row items-center border border-brand-accent rounded-full px-1",
    button: "w-9 h-9 rounded-full justify-center items-center",
    valueContainer: "min-w-[60px] items-center px-3",
  },
  variants: {
    disabled: {
      true: {
        button: "opacity-40",
      },
    },
  },
});

interface FractionalQuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  precision?: number;
  minIncrement?: number;
  maxValue?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  quickAddIncrements?: number[];
}

function parseLocalizedNumber(raw: string): number {
  let s = raw.trim();
  if (s === "") return 0;
  s = s.replace(/[^0-9.,+-]/g, "");
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && (!hasDot || s.lastIndexOf(",") > s.lastIndexOf("."))) {
    s = s.replace(/\./g, "").replace(/,/g, ".");
  } else {
    if (!hasComma && hasDot) {
      if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
        s = s.replace(/\./g, "");
      } else if (s.split(".").length - 1 > 1) {
        const parts = s.split(".");
        const decimal = parts.pop();
        s = parts.join("") + "." + decimal;
      }
    } else if (hasComma && hasDot) {
      s = s.replace(/,/g, "");
    }
    s = s.replace(/,/g, "");
  }
  const n = parseFloat(s);
  if (isNaN(n)) return 0;
  return n;
}

function FractionalQuantityInput({
  value,
  onChange,
  precision = 2,
  minIncrement,
  maxValue = 999999,
  style,
  disabled,
  quickAddIncrements,
}: FractionalQuantityInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const effectiveIncrement = useMemo(() => {
    if (minIncrement && minIncrement > 0) return minIncrement;
    return 1 / Math.pow(10, precision);
  }, [minIncrement, precision]);

  const chips = useMemo(() => {
    if (quickAddIncrements && quickAddIncrements.length > 0) return quickAddIncrements;
    const base = effectiveIncrement;
    if (base >= 1) return [1, 2, 5];
    if (base >= 0.5) return [0.5, 1, 2];
    if (base >= 0.25) return [0.25, 0.5, 1];
    if (base >= 0.1) return [0.1, 0.25, 0.5];
    return [base, base * 2, base * 5];
  }, [effectiveIncrement, quickAddIncrements]);

  const applyValue = useCallback(
    (next: number) => {
      if (next < 0) next = 0;
      if (next > maxValue) next = maxValue;
      next = normalizeQuantity(next, effectiveIncrement, precision);
      onChange(next);
    },
    [onChange, maxValue, effectiveIncrement, precision],
  );

  function handleDecrement() {
    applyValue(value - 1);
  }

  function handleIncrement() {
    applyValue(value + 1);
  }

  function openModal() {
    setDraft(String(value));
    setModalVisible(true);
  }

  function confirmDraft() {
    let parsed = parseLocalizedNumber(draft);
    parsed = roundTo(parsed, precision);
    if (parsed < 0) parsed = 0;
    if (parsed > maxValue) parsed = maxValue;
    onChange(parsed);
    setModalVisible(false);
  }

  const formatted = useMemo(() => value.toFixed(precision), [value, precision]);

  const modalChips: EditableValueModalChip[] = (chips as number[]).map((item) => ({
    label: `+${item}`,
    onPress: () => {
      const base = parseLocalizedNumber(draft) || 0;
      const next = roundTo(base + item, precision);
      setDraft(String(next));
    },
  }));

  const decrementStyles = fractionalQuantityInput({ disabled: disabled || value <= 0 });
  const incrementStyles = fractionalQuantityInput({ disabled });
  const containerStyles = fractionalQuantityInput();

  return (
    <View
      accessibilityLabel={`Cantidad ${formatted}`}
      className={containerStyles.container()}
      style={style}
    >
      <TouchableOpacity
        className={decrementStyles.button()}
        disabled={disabled || value <= 0}
        onPress={handleDecrement}
      >
        <Display.Icon name="minus" size={16} type="feather" />
      </TouchableOpacity>

      <TouchableOpacity
        className={containerStyles.valueContainer()}
        disabled={disabled}
        onPress={openModal}
      >
        <Typography.Text semibold variant="body">
          {formatted}
        </Typography.Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={incrementStyles.button()}
        disabled={disabled}
        onPress={handleIncrement}
      >
        <Display.Icon name="plus" size={16} type="feather" />
      </TouchableOpacity>

      <Dialog.EditValue
        chips={modalChips}
        keyboardType="decimal-pad"
        onCancel={() => setModalVisible(false)}
        onChangeValue={setDraft}
        onConfirm={confirmDraft}
        placeholder={`0${precision > 0 ? ",".padEnd(precision + 1, "0") : ""}`}
        rightAdornment={
          <Typography.Text className="ml-1" variant="body">
            (mín {effectiveIncrement})
          </Typography.Text>
        }
        title="Editar cantidad"
        value={draft}
        visible={modalVisible}
      />
    </View>
  );
}

export default FractionalQuantityInput;
