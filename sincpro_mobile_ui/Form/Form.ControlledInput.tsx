import Field, { type FieldRules } from "@sincpro/mobile-ui/Form/Form.Field";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import type { Control, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  rules?: FieldRules<T, Path<T>>;
  error?: string;
}

function ControlledInput<T extends FieldValues>({
  control,
  name,
  rules,
  error,
  ...input
}: ControlledInputProps<T>) {
  return (
    <Field
      control={control}
      error={error}
      name={name}
      render={({ value, onChange, onBlur, error: message }) => (
        <Input
          {...input}
          error={message}
          onBlur={onBlur}
          onChangeText={onChange as (text: string) => void}
          value={value}
        />
      )}
      rules={rules}
    />
  );
}

export default ControlledInput;
