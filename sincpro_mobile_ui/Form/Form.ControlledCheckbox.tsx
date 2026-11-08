import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import Field from "@sincpro/mobile-ui/Form/Form.Field";
import type { Control, FieldValues, Path } from "react-hook-form";

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
    <Field
      control={control}
      name={name}
      render={({ value, onChange }) => (
        <Checkbox
          isChecked={Boolean(value)}
          mainText={label}
          onCheck={onChange as (checked: boolean) => void}
          subText={subText}
        />
      )}
    />
  );
}

export default ControlledCheckbox;
