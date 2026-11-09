import { Display } from "@sincpro/mobile-ui/Display";
import { inputTextStyle } from "@sincpro/mobile-ui/Form/input-text";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Ref } from "react";
import { useState } from "react";
import {
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

type FieldState = "error" | "focused" | "default";

// `card`: filled surface, the default of forms built with the DS. Same box as the
// Select, DatePicker, PickerField and Dropdown triggers.
const cardBox = tv({
  base: "rounded-lg bg-bg-card",
  variants: {
    state: {
      error: "border-2 border-danger",
      focused: "border-2 border-border-focus",
      default: "border border-input",
    },
  },
  defaultVariants: { state: "default" },
});

// `outline`: bordered input without surface, the look of the access forms
// (login, server, reset). The border lives on the TextInput, so the height is 44.
const outlineInput = tv({
  base: "h-11 text-text-primary rounded p-2",
  variants: {
    state: {
      error: "border-2 border-danger",
      focused: "border-2 border-border-focus",
      default: "border border-input",
    },
  },
  defaultVariants: { state: "default" },
});

export interface FormInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  ref?: Ref<TextInputInstance>;
  label?: string;
  error?: string;
  tooltip?: string;
  /** `card` (default) or `outline`. Same behavior; see the class tables above. */
  look?: "card" | "outline";
  /** Hides the text and shows a toggle to reveal it (passwords, PINs typed as text). */
  secure?: boolean;
  /** Classes of the wrapper (spacing, width). */
  className?: string;
}

function SecureToggle({
  visible,
  onToggle,
  className,
}: {
  visible: boolean;
  onToggle: () => void;
  className: string;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      accessibilityRole="button"
      className={className}
      hitSlop={8}
      onPress={onToggle}
    >
      <Display.Icon
        color={theme.text.primary}
        name={visible ? "hidden" : "visibility"}
        size={22}
      />
    </TouchableOpacity>
  );
}

/**
 * The text field of the DS. One behavior (label, focus and error states, accessibility,
 * secure toggle) with two looks:
 *
 * | look      | label                  | field                                   | bottom space |
 * | --------- | ---------------------- | --------------------------------------- | ------------ |
 * | `card`    | bodySmall, semibold    | card surface, rounded-lg, ≥48           | 8            |
 * | `outline` | bodyLarge              | border only, rounded, 44 high           | 16           |
 */
function FormInput({
  label,
  error,
  tooltip,
  look = "card",
  secure = false,
  style,
  multiline = false,
  numberOfLines = 1,
  onFocus,
  onBlur,
  onSubmitEditing,
  submitBehavior,
  className,
  ref,
  ...props
}: FormInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasError = Boolean(error);
  const state: FieldState = hasError ? "error" : isFocused ? "focused" : "default";

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const toggle = () => setRevealed((value) => !value);
  // "Next" on the keyboard moves to the next field on Android and iOS alike, with the
  // keyboard kept open. Android has no toolbar by convention, so without this a form whose
  // screen did not wire refs could not move past its first field there.
  const advances = props.returnKeyType === "next" && !multiline && !onSubmitEditing;
  const shared = {
    accessibilityHint: error || tooltip,
    accessibilityLabel: label,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onSubmitEditing: advances ? () => KeyboardController.setFocusTo("next") : onSubmitEditing,
    submitBehavior: advances ? ("submit" as const) : submitBehavior,
    placeholderTextColor: theme.text.tertiary,
    ref,
    secureTextEntry: secure && !revealed,
    selectionColor: theme.primary,
    underlineColorAndroid: "transparent",
  } as const;

  const errorText = hasError ? (
    <Typography.Text
      accessibilityLiveRegion="polite"
      className={look === "card" ? "mt-0.5 text-danger" : "mt-1 text-danger"}
      variant="bodySmall"
    >
      {error}
    </Typography.Text>
  ) : null;

  if (look === "outline") {
    const field = (
      <View className={cn("mb-4", className)}>
        {label ? (
          <Typography.Text className="mb-1" variant="bodyLarge">
            {label}
          </Typography.Text>
        ) : null}
        <TextInput
          className={outlineInput({ state })}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[inputTextStyle(), style]}
          {...shared}
          {...props}
        />
        {errorText}
      </View>
    );
    if (!secure) return field;
    // The toggle sits over the field, 25 from the bottom of the wrapper.
    return (
      <View className="mb-4 relative">
        {field}
        <SecureToggle
          className="absolute right-3 bottom-[25px]"
          onToggle={toggle}
          visible={revealed}
        />
      </View>
    );
  }

  return (
    <View className={cn("mb-2", className)}>
      {label ? (
        <Typography.Text className="mb-1 text-text-primary" semibold variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}
      <View className={cn(cardBox({ state }), secure && "flex-row items-center")}>
        <TextInput
          className={cn(
            "px-3 py-2.5 min-h-[48px] text-text-primary",
            multiline && "min-h-[64px] pt-2.5",
            secure && "flex-1",
          )}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[inputTextStyle(), { minHeight: multiline ? 64 : 48 }, style]}
          textAlignVertical={multiline ? "top" : "center"}
          {...shared}
          {...props}
        />
        {secure ? (
          <SecureToggle className="px-3" onToggle={toggle} visible={revealed} />
        ) : null}
      </View>
      {errorText}
    </View>
  );
}

export default FormInput;
