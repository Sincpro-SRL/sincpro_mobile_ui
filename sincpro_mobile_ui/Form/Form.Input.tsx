import { theme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ComponentRef, Ref } from "react";
import { useState } from "react";
import { TextInput, type TextInputProps, View } from "react-native";

const inputContainer = tv({
  base: "rounded-lg bg-bg-card shadow-sm",
  variants: {
    state: {
      error: "border-2 border-danger",
      focused: "border-2 border-border-focus",
      default: "border border-input",
    },
  },
  defaultVariants: { state: "default" },
});

interface FormInputProps extends TextInputProps {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  error?: string;
  tooltip?: string;
  className?: string;
  accessibleSizing?: boolean;
}

function FormInput({
  label,
  error,
  tooltip,
  style,
  multiline = false,
  numberOfLines = 1,
  onFocus,
  onBlur,
  className,
  accessibleSizing = false,
  ref,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getState = () => {
    if (hasError) return "error";
    if (isFocused) return "focused";
    return "default";
  };

  return (
    <View className={cn("mb-2", className)}>
      <Typography.Text className="mb-1 font-medium text-text-primary" variant="bodySmall">
        {label}
      </Typography.Text>
      <View className={inputContainer({ state: getState() })}>
        <TextInput
          accessibilityHint={error || tooltip}
          accessibilityLabel={label}
          className={cn(
            "px-3 py-2.5 text-sm min-h-[44px] text-text-primary",
            multiline && "min-h-[64px] pt-2.5",
          )}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={theme.text.tertiary}
          ref={ref}
          selectionColor={theme.primary}
          style={[accessibleSizing ? { minHeight: 48 } : undefined, style]}
          textAlignVertical={multiline ? "top" : "center"}
          underlineColorAndroid="transparent"
          {...props}
        />
      </View>
      {hasError && (
        <Typography.Text
          accessibilityLiveRegion="polite"
          className="mt-0.5 text-danger"
          variant="bodySmall"
        >
          {error}
        </Typography.Text>
      )}
    </View>
  );
}

export default FormInput;
