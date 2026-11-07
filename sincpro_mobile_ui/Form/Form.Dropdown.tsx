import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { type ComponentProps, type ReactNode, useState } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  type TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";

const dropdown = tv({
  slots: {
    button: "flex-row justify-between items-center rounded-lg px-3",
    overlay: "flex-1 bg-black/40 justify-center items-center",
    dropdownContainer: "rounded-xl mx-5 max-w-[320px] w-[90%] max-h-[70%]",
    header: "flex-row justify-between items-center px-4 py-3 border-b border-border-default",
    optionsList: "p-1",
    option: "py-3 px-3 rounded-lg my-0.5",
    separator: "h-[1px] bg-border-light mx-3",
  },
  variants: {
    variant: {
      primary: {
        button: "bg-primary",
      },
      secondary: {
        button: "bg-bg-card border border-primary",
      },
      outline: {
        button: "bg-transparent border border-primary",
      },
    },
    size: {
      xs: {
        button: "py-1.5 min-h-[32px]",
      },
      small: {
        button: "py-2 min-h-[36px]",
      },
      medium: {
        button: "py-2.5 min-h-[40px]",
      },
      large: {
        button: "py-3 min-h-[44px]",
      },
    },
    disabled: {
      true: {
        option: "opacity-50",
      },
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "small",
  },
});

export interface DropdownOption {
  id: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface DropdownButtonProps {
  title: string;
  options: readonly DropdownOption[];
  variant?: "primary" | "secondary" | "outline";
  size?: "xs" | "small" | "medium" | "large";
  disabled?: boolean;
  closeAccessibilityLabel?: string;
  buttonProps?: Omit<TouchableOpacityProps, "children" | "onPress" | "disabled">;
  contentProps?: Omit<ViewProps, "children">;
  optionProps?: Omit<TouchableOpacityProps, "children" | "onPress" | "disabled">;
  titleTextProps?: ComponentProps<typeof Typography.Text>;
  optionTextProps?: ComponentProps<typeof Typography.Text>;
  renderOption?: (option: DropdownOption) => ReactNode;
  testID?: string;
}

function DropdownButton({
  title,
  options,
  variant = "secondary",
  size = "small",
  disabled = false,
  closeAccessibilityLabel = "Cerrar opciones",
  buttonProps,
  contentProps,
  optionProps,
  titleTextProps,
  optionTextProps,
  renderOption,
  testID,
}: DropdownButtonProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionPress = (option: DropdownOption) => {
    if (!option.disabled) {
      option.onPress();
      setIsOpen(false);
    }
  };

  const styles = dropdown({ variant, size });

  const textColorClass = {
    primary: "text-text-on-primary",
    outline: "text-text-accent",
    secondary: "text-text-accent",
  }[variant];

  const iconColor = {
    primary: theme.text.onPrimary,
    outline: theme.text.accent,
    secondary: theme.text.accent,
  }[variant];

  const textVariant = {
    large: "body" as const,
    medium: "body" as const,
    xs: "bodySmall" as const,
    small: "bodySmall" as const,
  }[size];

  return (
    <>
      <TouchableOpacity
        {...buttonProps}
        accessibilityLabel={buttonProps?.accessibilityLabel ?? title}
        accessibilityRole="button"
        accessibilityState={{
          ...buttonProps?.accessibilityState,
          disabled,
          expanded: isOpen,
        }}
        activeOpacity={0.7}
        className={cn(styles.button(), buttonProps?.className)}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={[{ minHeight: 48, minWidth: 48 }, buttonProps?.style]}
        testID={testID}
      >
        <Typography.Text className={textColorClass} variant={textVariant}>
          {title}
        </Typography.Text>
        <Icon color={iconColor} name="chevron-down" size={16} type="feather" />
      </TouchableOpacity>

      <Modal
        animationType={reducedMotion ? "none" : "fade"}
        onRequestClose={() => setIsOpen(false)}
        presentationStyle="overFullScreen"
        transparent
        visible={isOpen}
      >
        <View className={styles.overlay()}>
          <TouchableWithoutFeedback accessible={false} onPress={() => setIsOpen(false)}>
            <View className="absolute inset-0" />
          </TouchableWithoutFeedback>
          <View
            {...contentProps}
            accessibilityViewIsModal
            className={cn(styles.dropdownContainer(), contentProps?.className)}
            onAccessibilityEscape={() => setIsOpen(false)}
            style={[
              {
                backgroundColor: theme.bg.popover,
                ...theme.shadow.lg,
              },
              contentProps?.style,
            ]}
          >
            <View className={styles.header()}>
              <Typography.Text
                {...titleTextProps}
                accessibilityRole="header"
                className={cn("text-text-primary", titleTextProps?.className)}
                semibold={titleTextProps?.semibold ?? true}
                variant={titleTextProps?.variant ?? "bodyLarge"}
              >
                {title}
              </Typography.Text>
              <IconButton
                accessibilityLabel={closeAccessibilityLabel}
                icon="close"
                onPress={() => setIsOpen(false)}
              />
            </View>

            <ScrollView
              contentContainerClassName={styles.optionsList()}
              keyboardShouldPersistTaps="handled"
              style={{ flexShrink: 1 }}
            >
              {options.map((option, index) => (
                <View key={option.id}>
                  <TouchableOpacity
                    {...optionProps}
                    accessibilityLabel={option.title}
                    accessibilityRole="button"
                    accessibilityState={{
                      ...optionProps?.accessibilityState,
                      disabled: option.disabled,
                    }}
                    activeOpacity={0.7}
                    className={cn(
                      dropdown({ disabled: option.disabled }).option(),
                      optionProps?.className,
                    )}
                    disabled={option.disabled}
                    onPress={() => handleOptionPress(option)}
                    style={[{ minHeight: 48, minWidth: 48 }, optionProps?.style]}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <Typography.Text
                        {...optionTextProps}
                        className={cn(
                          option.disabled ? "text-text-disabled" : "text-text-primary",
                          optionTextProps?.className,
                        )}
                        variant={optionTextProps?.variant ?? "body"}
                      >
                        {option.title}
                      </Typography.Text>
                    )}
                  </TouchableOpacity>
                  {index < options.length - 1 && <View className={styles.separator()} />}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default DropdownButton;
