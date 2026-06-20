import RadioButton from "@sincpro/mobile-ui/Form/Form.RadioButton";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface ControlledRadioButtonProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  value: any;
}

function ControlledRadioButton<T extends FieldValues>({
  control,
  name,
  label,
  value,
}: ControlledRadioButtonProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value: selectedValue } }) => (
        <RadioButton
          label={label}
          onPress={() => onChange(value)}
          selected={selectedValue === value}
        />
      )}
    />
  );
}

export default ControlledRadioButton;
