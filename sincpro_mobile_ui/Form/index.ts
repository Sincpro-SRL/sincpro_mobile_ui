import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import ControlledCheckbox from "@sincpro/mobile-ui/Form/Form.ControlledCheckbox";
import ControlledDropdown from "@sincpro/mobile-ui/Form/Form.ControlledDropdown";
import ControlledInput from "@sincpro/mobile-ui/Form/Form.ControlledInput";
import ControlledMonetaryInput from "@sincpro/mobile-ui/Form/Form.ControlledMonetaryInput";
import ControlledRadioButton from "@sincpro/mobile-ui/Form/Form.ControlledRadioButton";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Dropdown from "@sincpro/mobile-ui/Form/Form.Dropdown";
import ErrorSummary from "@sincpro/mobile-ui/Form/Form.ErrorSummary";
import FractionalQuantityInput from "@sincpro/mobile-ui/Form/Form.FractionalQuantityInput";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import InputField from "@sincpro/mobile-ui/Form/Form.InputField";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import KeyboardToolbar from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import MonetaryInput from "@sincpro/mobile-ui/Form/Form.MonetaryInput";
import PasswordInput from "@sincpro/mobile-ui/Form/Form.PasswordInput";
import PinInput from "@sincpro/mobile-ui/Form/Form.PinInput";
import QuantitySelector from "@sincpro/mobile-ui/Form/Form.QuantitySelector";
import RadioButton from "@sincpro/mobile-ui/Form/Form.RadioButton";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import Slider from "@sincpro/mobile-ui/Form/Form.Slider";
import Switch from "@sincpro/mobile-ui/Form/Form.Switch";
import TextInput from "@sincpro/mobile-ui/Form/Form.TextInput";

export const Form = {
  TextInput,
  Input,
  InputField,
  KeyboardForm,
  KeyboardToolbar,
  ErrorSummary,
  PasswordInput,
  QuantitySelector,
  FractionalQuantityInput,
  RadioButton,
  Checkbox,
  Switch,
  Select,
  PinInput,
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
export type { KeyboardFormProps } from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
export type {
  KeyboardToolbarAction,
  KeyboardToolbarProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
export type { SelectOption, SelectProps } from "@sincpro/mobile-ui/Form/Form.Select";
export type { SliderProps } from "@sincpro/mobile-ui/Form/Form.Slider";

export default Form;
