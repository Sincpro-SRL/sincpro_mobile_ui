import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable, { type PressableProps } from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";
import { type ReactNode, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export type DropdownOption = {
  id: string;
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
};

export type DropdownButtonProps = {
  title: string;
  options: readonly DropdownOption[];
  variant?: "primary" | "secondary" | "outline";
  size?: "xs" | "small" | "medium" | "large";
  disabled?: boolean;
  readOnly?: boolean;
  buttonProps?: Omit<PressableProps, "children" | "onPress" | "disabled">;
  renderOption?: (option: DropdownOption) => ReactNode;
  testID?: string;
};

function Dropdown({
  title,
  options,
  variant = "secondary",
  size = "small",
  disabled = false,
  readOnly = false,
  buttonProps,
  renderOption,
  testID,
}: DropdownButtonProps) {
  const theme = useTheme();
  const saving = useRef(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string>();
  const [error, setError] = useState<string>();
  const blocked = disabled || readOnly || pending !== undefined;
  const close = () => {
    if (!saving.current) setOpen(false);
  };
  const choose = async (option: DropdownOption) => {
    if (blocked || option.disabled || saving.current) return;
    saving.current = true;
    setPending(option.id);
    setError(undefined);
    const result = await attempt(async () => {
      await option.onPress();
      setOpen(false);
    });
    saving.current = false;
    setPending(undefined);
    if (!result.ok) {
      setError(
        errorMessage(result.error, "No se pudo completar la acción. Vuelve a intentarlo."),
      );
    }
  };

  return (
    <>
      <Pressable
        {...buttonProps}
        accessibilityLabel={buttonProps?.accessibilityLabel ?? title}
        accessibilityRole="button"
        accessibilityState={{
          ...buttonProps?.accessibilityState,
          disabled: blocked,
          expanded: open,
        }}
        className={cn(
          "flex-row items-center justify-between gap-3 rounded-lg px-3",
          variant === "primary"
            ? "bg-primary"
            : variant === "secondary"
              ? "bg-bg-card border border-primary"
              : "bg-transparent border border-primary",
          buttonProps?.className,
        )}
        disabled={blocked}
        onPress={() => {
          setError(undefined);
          setOpen(true);
        }}
        style={[
          {
            minHeight: 48,
            minWidth: 48,
            paddingVertical: { xs: 6, small: 8, medium: 10, large: 12 }[size],
          },
          buttonProps?.style,
        ]}
        testID={testID}
      >
        <Typography.Text
          className={variant === "primary" ? "text-text-on-primary" : "text-text-accent"}
          variant={size === "large" || size === "medium" ? "body" : "bodySmall"}
        >
          {title}
        </Typography.Text>
        <Icon
          color={variant === "primary" ? theme.text.onPrimary : theme.text.accent}
          name="expand"
          size={16}
        />
      </Pressable>
      <Sheet dismissible={pending === undefined} onClose={close} title={title} visible={open}>
        {options.map((option) => (
          <Pressable
            accessibilityLabel={option.title}
            accessibilityRole="button"
            accessibilityState={{
              disabled: blocked || !!option.disabled,
              busy: pending === option.id,
            }}
            className="flex-row items-center gap-3 border-b border-border-light py-3"
            disabled={blocked || option.disabled}
            key={option.id}
            onPress={() => void choose(option)}
            style={{ minHeight: 48, minWidth: 48 }}
          >
            <View className="flex-1">
              {renderOption ? (
                renderOption(option)
              ) : (
                <Typography.Text
                  className={option.disabled ? "text-text-disabled" : "text-text-primary"}
                >
                  {option.title}
                </Typography.Text>
              )}
            </View>
            {pending === option.id ? <ActivityIndicator color={theme.primary} /> : null}
          </Pressable>
        ))}
        {!options.length ? (
          <Typography.Text>No hay opciones disponibles.</Typography.Text>
        ) : null}
        {error ? (
          <Typography.Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            className="pt-3 text-danger"
            selectable
          >
            {error}
          </Typography.Text>
        ) : null}
      </Sheet>
    </>
  );
}

export default Dropdown;
