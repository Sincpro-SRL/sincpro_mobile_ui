import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, ScrollView, View } from "react-native";
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
  showCloseButton?: boolean;
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
  showCloseButton = true,
}: SelectProps<T>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? null;
  // eslint-disable-next-line react-hooks/refs
  const translateY = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    if (open) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
    } else {
      translateY.setValue(800);
    }
  }, [open, translateY]);

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      {label ? (
        <Typography.Text className="font-medium text-text-primary" variant="bodySmall">
          {label}
        </Typography.Text>
      ) : null}

      <Pressable
        accessibilityHint="Abre la lista de opciones"
        accessibilityLabel={
          label
            ? `${label}: ${selected?.label ?? placeholder}`
            : (selected?.label ?? placeholder)
        }
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        className="flex-row items-center justify-between rounded-lg border border-input bg-bg-card px-3 min-h-[48px]"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{ minHeight: 48, minWidth: 48 }}
      >
        <Typography.Text
          className={cn(
            "flex-1 text-sm",
            selected ? "text-text-primary" : "text-text-tertiary",
          )}
          style={{ paddingVertical: 12 }}
        >
          {selected ? selected.label : placeholder}
        </Typography.Text>
        <Icon color={theme.icon.secondary} name="chevron-down" size={18} />
      </Pressable>

      <Modal
        animationType="none"
        onRequestClose={() => setOpen(false)}
        presentationStyle="overFullScreen"
        transparent
        visible={open}
      >
        <View className="flex-1 justify-end">
          <View
            accessibilityElementsHidden
            className="absolute inset-0 bg-black/50"
            importantForAccessibility="no-hide-descendants"
            onResponderRelease={() => setOpen(false)}
            onStartShouldSetResponder={() => true}
          />
          <Animated.View
            accessibilityViewIsModal
            className="rounded-t-3xl"
            importantForAccessibility="yes"
            onAccessibilityEscape={() => setOpen(false)}
            style={[
              vars(themeToVars(theme)),
              {
                transform: [{ translateY }],
                maxHeight: "70%",
                backgroundColor: theme.bg.card,
                paddingBottom: insets.bottom + 8,
              },
            ]}
          >
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-border-strong" />
            </View>
            {title || showCloseButton ? (
              <View className="flex-row items-center justify-between px-4">
                <Typography.Text
                  accessibilityRole="header"
                  className="flex-1 text-text-primary py-2"
                  semibold
                  variant="body"
                >
                  {title ?? label ?? "Seleccionar"}
                </Typography.Text>
                {showCloseButton ? (
                  <Pressable
                    accessibilityLabel="Cerrar opciones"
                    onPress={() => setOpen(false)}
                    style={{
                      minWidth: 48,
                      minHeight: 48,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography.Text className="text-text-accent" variant="bodySmall">
                      Cerrar
                    </Typography.Text>
                  </Pressable>
                ) : null}
              </View>
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
                    style={{ minHeight: 48, minWidth: 48 }}
                  >
                    <Typography.Text
                      className={cn(
                        "flex-1 text-sm",
                        isSelected ? "text-text-accent font-semibold" : "text-text-primary",
                      )}
                    >
                      {option.label}
                    </Typography.Text>
                    {isSelected ? (
                      <Icon color={theme.text.accent} name="checkmark" size={18} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

export default Select;
