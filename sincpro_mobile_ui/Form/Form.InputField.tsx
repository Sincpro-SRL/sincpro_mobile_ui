import TextInputF from "@sincpro/mobile-ui/Form/Form.TextInput";
import { tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import React, { FC, useState } from "react";
import { TextInputProps, View } from "react-native";

const inputFieldBorder = tv({
  base: "rounded p-2",
  variants: {
    state: {
      error: "border-2 border-danger",
      focused: "border-2 border-ring",
      default: "border border-input",
    },
  },
  defaultVariants: { state: "default" },
});

export interface InputFieldProps extends TextInputProps {
  label: string;
  inputProps: React.ComponentProps<typeof TextInputF>;
  error?: string;
}

const InputField: FC<InputFieldProps> = ({ label, inputProps, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    inputProps?.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    inputProps?.onBlur?.(e);
  };

  const getState = () => {
    if (hasError) return "error";
    if (isFocused) return "focused";
    return "default";
  };

  return (
    <View className="mb-4">
      <Typography.Text className="mb-1" variant="bodyLarge">
        {label}
      </Typography.Text>
      <TextInputF
        className={inputFieldBorder({ state: getState() })}
        {...inputProps}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {error && (
        <Typography.Text className="mt-1 text-danger" variant="bodySmall">
          {error}
        </Typography.Text>
      )}
    </View>
  );
};

export default InputField;
