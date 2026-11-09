import { ChoiceRow } from "@sincpro/mobile-ui/Form/choice-row";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** One option of a single-choice group: the same row Select and PickerField list. */
function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return <ChoiceRow label={label} onPress={onPress} selected={selected} />;
}

export default RadioButton;
