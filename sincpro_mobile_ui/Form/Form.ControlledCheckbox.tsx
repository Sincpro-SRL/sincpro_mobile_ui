import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface ControlledCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  subText?: string;
}

function ControlledCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  subText,
}: ControlledCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Checkbox
          isChecked={value || false}
          mainText={label}
          onCheck={onChange}
          subText={subText}
        />
      )}
    />
  );
}

export default ControlledCheckbox;
