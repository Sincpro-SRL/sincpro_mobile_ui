import { Control, FieldValues, Path } from "react-hook-form";

export interface DropdownOption {
  value: string;
  label: string;
}

interface ControlledDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
}

function ControlledDropdown<T extends FieldValues>(_props: ControlledDropdownProps<T>) {
  throw new Error(
    "ControlledDropdown is not implemented yet. Use Form.Dropdown with manual Controller instead.",
  );
}

export default ControlledDropdown;
