import { useState } from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { tv } from "tailwind-variants";

import { Display } from "../Display";
import { theme } from "../theme";
import { Typography } from "../Typography";

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

interface DropdownButtonProps {
  title: string;
  options: DropdownOption[];
  variant?: "primary" | "secondary" | "outline";
  size?: "xs" | "small" | "medium" | "large";
}

function DropdownButton({
  title,
  options,
  variant = "secondary",
  size = "small",
}: DropdownButtonProps) {
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
    outline: "text-primary",
    secondary: "text-primary",
  }[variant];

  const iconColor = {
    primary: theme.text.onPrimary,
    outline: theme.primary,
    secondary: theme.primary,
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
        activeOpacity={0.7}
        className={styles.button()}
        onPress={() => setIsOpen(true)}
      >
        <Typography.Text className={textColorClass} variant={textVariant}>
          {title}
        </Typography.Text>
        <Display.Icon color={iconColor} name="chevron-down" size={16} type="feather" />
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={isOpen}>
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className={styles.overlay()}>
            <TouchableWithoutFeedback>
              <View
                className={styles.dropdownContainer()}
                style={{
                  backgroundColor: theme.bg.popover,
                  ...theme.shadow.lg,
                }}
              >
                <View className={styles.header()}>
                  <Typography.Text className="text-text-primary" semibold variant="bodyLarge">
                    {title}
                  </Typography.Text>
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Display.Icon name="x" size={20} type="feather" />
                  </TouchableOpacity>
                </View>

                <View className={styles.optionsList()}>
                  {options.map((option, index) => (
                    <View key={option.id}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        className={dropdown({ disabled: option.disabled }).option()}
                        disabled={option.disabled}
                        onPress={() => handleOptionPress(option)}
                      >
                        <Typography.Text
                          className={
                            option.disabled ? "text-text-disabled" : "text-text-primary"
                          }
                          variant="body"
                        >
                          {option.title}
                        </Typography.Text>
                      </TouchableOpacity>
                      {index < options.length - 1 && <View className={styles.separator()} />}
                    </View>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

export default DropdownButton;
