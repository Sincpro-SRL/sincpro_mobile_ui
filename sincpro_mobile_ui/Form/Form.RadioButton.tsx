import { Typography } from "@sincpro/mobile-ui/Typography";
import { TouchableOpacity, View } from "react-native";
import { tv } from "tailwind-variants";

const radioButton = tv({
  slots: {
    container:
      "flex-row items-center py-2.5 px-3 rounded-lg border-[1.5px] border-border-default bg-bg-card",
    radioCircle:
      "w-[18px] h-[18px] rounded-full border-2 border-border-default mr-2 justify-center items-center",
    radioInner: "w-[9px] h-[9px] rounded-full",
    label: "flex-1",
  },
  variants: {
    selected: {
      true: {
        container: "border-accent bg-accent/10",
        radioCircle: "border-accent",
        radioInner: "bg-accent",
        label: "text-text-primary font-semibold",
      },
      false: {
        label: "text-text-secondary",
      },
    },
  },
  defaultVariants: { selected: false },
});

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  const styles = radioButton({ selected });

  return (
    <TouchableOpacity activeOpacity={0.7} className={styles.container()} onPress={onPress}>
      <View className={styles.radioCircle()}>
        {selected && <View className={styles.radioInner()} />}
      </View>
      <Typography.Text className={styles.label()} variant="bodySmall">
        {label}
      </Typography.Text>
    </TouchableOpacity>
  );
}

export default RadioButton;
