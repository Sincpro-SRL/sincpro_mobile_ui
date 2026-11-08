import Field from "@sincpro/mobile-ui/Form/Form.Field";
import RadioButton from "@sincpro/mobile-ui/Form/Form.RadioButton";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";

interface ControlledRadioButtonProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  value: PathValue<T, Path<T>>;
}

function ControlledRadioButton<T extends FieldValues>({
  control,
  name,
  label,
  value,
}: ControlledRadioButtonProps<T>) {
  return (
    <Field
      control={control}
      name={name}
      render={({ value: selected, onChange }) => (
        <RadioButton
          label={label}
          onPress={() => onChange(value)}
          selected={selected === value}
        />
      )}
    />
  );
}

export default ControlledRadioButton;
