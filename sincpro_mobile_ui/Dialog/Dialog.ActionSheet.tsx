import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import { useEffect, useRef } from "react";
import { Animated, Modal, ScrollView, View } from "react-native";
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
  testID?: string;
}

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
      <View className="flex-1 justify-end" testID={testID}>
        <View
          accessibilityElementsHidden
          className="absolute inset-0 bg-black/50"
          importantForAccessibility="no-hide-descendants"
          onResponderRelease={onClose}
          onStartShouldSetResponder={() => true}
        />
        <Animated.View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={[
            vars(themeToVars(theme)),
            {
              transform: [{ translateY }],
              maxHeight: "90%",
              paddingHorizontal: 12,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          {title || message ? (
            <View
              className="rounded-xl mb-2 px-4 py-3 items-center"
              style={{ backgroundColor: theme.bg.card }}
            >
              {title ? (
                <Typography.Text
                  accessibilityRole="header"
                  className="text-text-primary"
                  semibold
                >
                  {title}
                </Typography.Text>
              ) : null}
              {message ? (
                <Typography.Text className="text-text-secondary text-sm" variant="bodySmall">
                  {message}
                </Typography.Text>
              ) : null}
            </View>
          ) : null}

          <ScrollView
            bounces={false}
            className="rounded-xl overflow-hidden mb-2"
            style={{ backgroundColor: theme.bg.card }}
          >
            {actions.map((action, index) => (
              <Pressable
                accessibilityLabel={action.label}
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
                style={{ minHeight: 48 }}
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
          </ScrollView>

          <Pressable
            accessibilityLabel={cancelLabel}
            accessibilityRole="button"
            className="rounded-xl px-4 py-4 items-center"
            onPress={onClose}
            style={{ backgroundColor: theme.bg.card, minHeight: 48 }}
          >
            <Typography.Text className="text-text-accent" semibold>
              {cancelLabel}
            </Typography.Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default ActionSheet;
