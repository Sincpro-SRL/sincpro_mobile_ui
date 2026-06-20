import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { FC } from "react";
import { TextInput, TextInputProps } from "react-native";

export interface TextInputFProps extends TextInputProps {
  error?: string;
  className?: string;
}

const TextInputF: FC<TextInputFProps> = ({ className, ...props }) => {
  return (
    <TextInput
      {...props}
      className={cn(
        "border border-input rounded-md h-11 px-3 py-2 text-text-primary",
        className,
      )}
      placeholderTextColor={theme.text.tertiary}
      style={props.style}
    />
  );
};

export default TextInputF;
