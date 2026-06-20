import { Typography } from "@sincpro/mobile-ui/Typography";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native";

type CopyableTextProps =
  | {
      value: string;
      getValue?: never;
      label?: string;
      className?: string;
    }
  | {
      value?: never;
      getValue: () => string;
      label?: string;
      className?: string;
    };

function CopyableText({ value, getValue, label, className }: CopyableTextProps) {
  const hasStaticValue = value !== undefined;
  const displayText = label || value;

  const handleCopy = async () => {
    const textToCopy = hasStaticValue ? value : getValue();
    await Clipboard.setStringAsync(textToCopy);
  };

  return (
    <TouchableOpacity onPress={handleCopy}>
      <Typography.Text className={className || "text-primary"} semibold variant="bodySmall">
        {displayText}
      </Typography.Text>
    </TouchableOpacity>
  );
}

export default CopyableText;
