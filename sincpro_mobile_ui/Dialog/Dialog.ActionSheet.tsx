import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import type { IconName } from "@sincpro/mobile-ui/Display/icon-map";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export type ActionSheetAction = {
  label: string;
  icon?: IconName;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
};

export type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  actions: readonly ActionSheetAction[];
  title?: string;
  message?: string;
  cancelLabel?: string;
  testID?: string;
};

function ActionSheet({
  visible,
  onClose,
  actions,
  title,
  message,
  cancelLabel = "Cancelar",
  testID,
}: ActionSheetProps) {
  const theme = useTheme();
  const saving = useRef(false);
  const [pending, setPending] = useState<number>();
  const [error, setError] = useState<string>();
  const close = () => {
    if (saving.current) return;
    setError(undefined);
    onClose();
  };
  const choose = async (action: ActionSheetAction, index: number) => {
    if (action.disabled || saving.current) return;
    saving.current = true;
    setPending(index);
    setError(undefined);
    try {
      await action.onPress();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message.trim()
          ? cause.message
          : "No se pudo completar la acción. Vuelve a intentarlo.",
      );
    } finally {
      saving.current = false;
      setPending(undefined);
    }
  };

  return (
    <Sheet
      dismissible={pending === undefined}
      footer={
        <Pressable
          accessibilityLabel={cancelLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: pending !== undefined }}
          disabled={pending !== undefined}
          onPress={close}
          style={{ minHeight: 48, justifyContent: "center", alignItems: "center" }}
        >
          <Typography.Text className="text-text-accent" semibold>
            {cancelLabel}
          </Typography.Text>
        </Pressable>
      }
      onClose={close}
      testID={testID}
      title={title}
      visible={visible}
    >
      {message ? (
        <Typography.Text className="pb-3 text-text-secondary">{message}</Typography.Text>
      ) : null}
      {actions.map((action, index) => (
        <Pressable
          accessibilityLabel={action.label}
          accessibilityRole="button"
          accessibilityState={{
            disabled: !!action.disabled || pending !== undefined,
            busy: pending === index,
          }}
          className={cn(
            "flex-row items-center gap-3 py-3",
            index < actions.length - 1 && "border-b border-border-light",
          )}
          disabled={action.disabled || pending !== undefined}
          key={`${action.label}-${index}`}
          onPress={() => void choose(action, index)}
          style={{ minHeight: 48 }}
        >
          {action.icon ? (
            <Icon
              color={
                action.disabled
                  ? theme.icon.disabled
                  : action.destructive
                    ? theme.danger
                    : theme.icon.primary
              }
              name={action.icon}
              size={20}
            />
          ) : null}
          <Typography.Text
            className={cn(
              "flex-1",
              action.disabled
                ? "text-text-disabled"
                : action.destructive
                  ? "text-danger"
                  : "text-text-primary",
            )}
            semibold
          >
            {action.label}
          </Typography.Text>
          {pending === index ? <ActivityIndicator color={theme.primary} /> : null}
        </Pressable>
      ))}
      {!actions.length ? (
        <Typography.Text>No hay acciones disponibles.</Typography.Text>
      ) : null}
      {error ? (
        <View className="pt-3">
          <Typography.Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            className="text-danger"
            selectable
          >
            {error}
          </Typography.Text>
        </View>
      ) : null}
    </Sheet>
  );
}

export default ActionSheet;
