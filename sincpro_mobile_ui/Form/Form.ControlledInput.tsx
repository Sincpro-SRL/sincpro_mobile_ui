import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  rules?: any;
  error?: string;
}

function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline,
  numberOfLines,
  rules,
  error,
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          autoCapitalize={autoCapitalize}
          error={error}
          keyboardType={keyboardType}
          label={label}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onBlur={onBlur}
          onChangeText={onChange}
          placeholder={placeholder}
          value={value}
        />
      )}
      rules={rules}
    />
  );
}

export default ControlledInput;
