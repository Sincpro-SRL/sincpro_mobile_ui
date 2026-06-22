import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { Modal, Pressable as RNPressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

export interface SelectProps<T extends string | number> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

function Select<T extends string | number>({
  options,
  value,
  onChange,
  label,
  placeholder = "Seleccionar…",
  title,
  disabled = false,
  className,
  testID,
}: SelectProps<T>) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label ? (
        <Typography.Text className="font-medium text-text-primary" variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}

      <Pressable
        accessibilityHint="Abre la lista de opciones"
        accessibilityLabel={label ?? placeholder}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className="flex-row items-center justify-between rounded-lg border border-input bg-bg-card px-3 min-h-[44px]"
        disabled={disabled}
        onPress={() => setOpen(true)}
      >
        <Typography.Text
          className={cn(
            "flex-1 text-sm",
            selected ? "text-text-primary" : "text-text-tertiary",
          )}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Typography.Text>
        <Icon color={theme.icon.secondary} name="chevron-down" size={18} />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <RNPressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setOpen(false)}
        >
          <RNPressable
            className="rounded-t-3xl"
            style={{
              backgroundColor: theme.bg.card,
              paddingBottom: insets.bottom + 8,
              maxHeight: "70%",
            }}
          >
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-border-strong" />
            </View>
            {title ? (
              <Typography.Text
                className="text-text-primary px-4 py-2"
                semibold
                variant="body"
              >
                {title}
              </Typography.Text>
            ) : null}
            <ScrollView>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                    className="flex-row items-center justify-between px-4 py-3 border-b border-border-light"
                    key={String(option.value)}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Typography.Text
                      className={cn(
                        "flex-1 text-sm",
                        isSelected ? "text-primary font-semibold" : "text-text-primary",
                      )}
                    >
                      {option.label}
                    </Typography.Text>
                    {isSelected ? (
                      <Icon color={theme.primary} name="checkmark" size={18} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </RNPressable>
        </RNPressable>
      </Modal>
    </View>
  );
}

export default Select;
