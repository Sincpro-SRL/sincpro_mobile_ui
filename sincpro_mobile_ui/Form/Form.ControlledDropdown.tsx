import Field from "@sincpro/mobile-ui/Form/Form.Field";
import Select, { type SelectProps } from "@sincpro/mobile-ui/Form/Form.Select";
import type { Control, FieldValues, Path } from "react-hook-form";

export type ControlledDropdownProps<T extends FieldValues> = Omit<
  SelectProps<string>,
  "value" | "onChange" | "onBlur" | "error"
> & {
  control: Control<T>;
  name: Path<T>;
};

function ControlledDropdown<T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledDropdownProps<T>) {
  return (
    <Field
      control={control}
      name={name}
      render={({ value, onChange, onBlur, error, disabled }) => (
        <Select
          {...props}
          disabled={props.disabled || disabled}
          error={error}
          onBlur={onBlur}
          onChange={onChange as (selected: string) => void}
          value={typeof value === "string" ? value : null}
        />
      )}
    />
  );
}

export default ControlledDropdown;
