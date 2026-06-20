import { Control, Controller, FieldValues, Path } from "react-hook-form";

import MonetaryInput from "./Form.MonetaryInput";

interface ControlledMonetaryInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  currency?: string;
  rules?: any;
  error?: string;
}

function ControlledMonetaryInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  currency = "CRC",
  rules,
  error,
}: ControlledMonetaryInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <MonetaryInput
          amount={value}
          currencySymbol={currency}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      rules={rules}
    />
  );
}

export default ControlledMonetaryInput;
