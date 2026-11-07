import Select, { type SelectProps } from "@sincpro/mobile-ui/Form/Form.Select";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

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
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          {...props}
          disabled={props.disabled || field.disabled}
          error={fieldState.error?.message}
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={typeof field.value === "string" ? field.value : null}
        />
      )}
    />
  );
}

export default ControlledDropdown;
