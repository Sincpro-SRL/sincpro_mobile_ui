import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable as RNPressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ActionSheetAction {
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  actions: ActionSheetAction[];
  title?: string;
  message?: string;
  cancelLabel?: string;
}

function ActionSheet({
  visible,
  onClose,
  actions,
  title,
  message,
  cancelLabel = "Cancelar",
}: ActionSheetProps) {
  const insets = useSafeAreaInsets();
  // eslint-disable-next-line react-hooks/refs
  const translateY = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }).start();
    } else {
      translateY.setValue(800);
    }
  }, [visible, translateY]);

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <RNPressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <RNPressable style={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 12 }}>
            {title || message ? (
              <View
                className="rounded-xl mb-2 px-4 py-3 items-center"
                style={{ backgroundColor: theme.bg.card }}
              >
                {title ? (
                  <Typography.Text className="text-text-primary" semibold>
                    {title}
                  </Typography.Text>
                ) : null}
                {message ? (
                  <Typography.Text
                    className="text-text-secondary text-sm"
                    variant="bodySmall"
                  >
                    {message}
                  </Typography.Text>
                ) : null}
              </View>
            ) : null}

            <View
              className="rounded-xl overflow-hidden mb-2"
              style={{ backgroundColor: theme.bg.card }}
            >
              {actions.map((action, index) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: action.disabled }}
                  className={cn(
                    "flex-row items-center justify-center gap-2 px-4 py-4",
                    index < actions.length - 1 && "border-b border-border-light",
                  )}
                  disabled={action.disabled}
                  key={action.label}
                  onPress={() => {
                    onClose();
                    action.onPress();
                  }}
                >
                  {action.icon ? (
                    <Icon
                      color={action.destructive ? theme.danger : theme.icon.primary}
                      name={action.icon}
                      size={20}
                    />
                  ) : null}
                  <Typography.Text
                    className={cn(action.destructive ? "text-danger" : "text-text-primary")}
                    semibold
                  >
                    {action.label}
                  </Typography.Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              className="rounded-xl px-4 py-4 items-center"
              onPress={onClose}
              style={{ backgroundColor: theme.bg.card }}
            >
              <Typography.Text className="text-primary" semibold>
                {cancelLabel}
              </Typography.Text>
            </Pressable>
          </RNPressable>
        </Animated.View>
      </RNPressable>
    </Modal>
  );
}

export default ActionSheet;
