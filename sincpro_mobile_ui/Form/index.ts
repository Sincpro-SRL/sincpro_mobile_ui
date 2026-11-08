import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import ControlledCheckbox from "@sincpro/mobile-ui/Form/Form.ControlledCheckbox";
import ControlledDropdown from "@sincpro/mobile-ui/Form/Form.ControlledDropdown";
import ControlledInput from "@sincpro/mobile-ui/Form/Form.ControlledInput";
import ControlledMonetaryInput from "@sincpro/mobile-ui/Form/Form.ControlledMonetaryInput";
import ControlledRadioButton from "@sincpro/mobile-ui/Form/Form.ControlledRadioButton";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import ErrorSummary from "@sincpro/mobile-ui/Form/Form.ErrorSummary";
import Field from "@sincpro/mobile-ui/Form/Form.Field";
import FractionalQuantityInput from "@sincpro/mobile-ui/Form/Form.FractionalQuantityInput";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import KeyboardToolbarHost from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import MonetaryInput from "@sincpro/mobile-ui/Form/Form.MonetaryInput";
import PickerField from "@sincpro/mobile-ui/Form/Form.PickerField";
import PinInput from "@sincpro/mobile-ui/Form/Form.PinInput";
import QuantitySelector from "@sincpro/mobile-ui/Form/Form.QuantitySelector";
import RadioButton from "@sincpro/mobile-ui/Form/Form.RadioButton";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import Slider from "@sincpro/mobile-ui/Form/Form.Slider";
import Switch from "@sincpro/mobile-ui/Form/Form.Switch";

export const Form = {
  Field,
  Input,
  KeyboardForm,
  KeyboardToolbarHost,
  ErrorSummary,
  QuantitySelector,
  FractionalQuantityInput,
  RadioButton,
  Checkbox,
  Switch,
  Select,
  PinInput,
  PickerField,
  Slider,
  DatePicker,
  Dropdown,
  MonetaryInput,
  ControlledInput,
  ControlledRadioButton,
  ControlledCheckbox,
  ControlledDropdown,
  ControlledMonetaryInput,
};

export type { ControlledDropdownProps } from "@sincpro/mobile-ui/Form/Form.ControlledDropdown";
export type { DatePickerProps } from "@sincpro/mobile-ui/Form/Form.DatePicker";
export type {
  DropdownButtonProps,
  DropdownOption,
} from "@sincpro/mobile-ui/Form/Form.Dropdown";
export type {
  ErrorSummaryItem,
  ErrorSummaryProps,
} from "@sincpro/mobile-ui/Form/Form.ErrorSummary";
export type {
  FieldProps,
  FieldRenderProps,
  FieldRules,
} from "@sincpro/mobile-ui/Form/Form.Field";
export type { FormInputProps } from "@sincpro/mobile-ui/Form/Form.Input";
export type { KeyboardFormProps } from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
export type { KeyboardToolbarHostProps } from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
export { useKeyboardToolbarInset } from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
export type {
  PickerFieldProps,
  PickerOption,
} from "@sincpro/mobile-ui/Form/Form.PickerField";
export type { SelectOption, SelectProps } from "@sincpro/mobile-ui/Form/Form.Select";
export type { SliderProps } from "@sincpro/mobile-ui/Form/Form.Slider";

export default Form;
