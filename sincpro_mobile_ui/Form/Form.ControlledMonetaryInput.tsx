import Field, { type FieldRules } from "@sincpro/mobile-ui/Form/Form.Field";
import MonetaryInput from "@sincpro/mobile-ui/Form/Form.MonetaryInput";
import type { Control, FieldValues, Path } from "react-hook-form";

interface ControlledMonetaryInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  /** Not drawn: MonetaryInput has no label. Kept for API compatibility. */
  label: string;
  placeholder?: string;
  currency?: string;
  rules?: FieldRules<T, Path<T>>;
  /** Not drawn: MonetaryInput has no error slot. Kept for API compatibility. */
  error?: string;
}

function ControlledMonetaryInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  currency = "CRC",
  rules,
}: ControlledMonetaryInputProps<T>) {
  return (
    <Field
      control={control}
      name={name}
      render={({ value, onChange }) => (
        <MonetaryInput
          amount={value}
          currencySymbol={currency}
          onChange={onChange as (amount: number) => void}
          placeholder={placeholder}
        />
      )}
      rules={rules}
    />
  );
}

export default ControlledMonetaryInput;
