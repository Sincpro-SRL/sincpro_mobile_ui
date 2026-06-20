import ButtonWithIcon from "./Form.Button";
import Checkbox from "./Form.Checkbox";
import ControlledCheckbox from "./Form.ControlledCheckbox";
import ControlledDropdown, { type DropdownOption } from "./Form.ControlledDropdown";
import ControlledInput from "./Form.ControlledInput";
import ControlledMonetaryInput from "./Form.ControlledMonetaryInput";
import ControlledRadioButton from "./Form.ControlledRadioButton";
import Dropdown from "./Form.Dropdown";
import { FilterButton, FilterButtonGroup } from "./Form.FilterButton";
import FractionalQuantityInput from "./Form.FractionalQuantityInput";
import IconButton from "./Form.IconButton";
import Input from "./Form.Input";
import InputField from "./Form.InputField";
import MonetaryInput from "./Form.MonetaryInput";
import PasswordInput from "./Form.PasswordInput";
import QuantitySelector from "./Form.QuantitySelector";
import RadioButton from "./Form.RadioButton";
import SearchBar from "./Form.SearchBar";
import TextInput from "./Form.TextInput";

export const Form = {
  TextInput,
  Input,
  InputField,
  Button: ButtonWithIcon,
  IconButton,
  PasswordInput,
  QuantitySelector,
  FractionalQuantityInput,
  RadioButton,
  Checkbox,
  SearchBar,
  Dropdown,
  MonetaryInput,
  ControlledInput,
  ControlledRadioButton,
  ControlledCheckbox,
  ControlledDropdown,
  ControlledMonetaryInput,
  FilterButton,
  FilterButtonGroup,
};

export { type DropdownOption };

export default Form;
