import { BaseButton } from "@sincpro/mobile-ui/primitives/BaseButton";
import { theme } from "@sincpro/mobile-ui/theme";
import Typography from "@sincpro/mobile-ui/Typography/Typography.Text";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";

export interface Props {
  auxTitle?: string;
  subtitle?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<Props> = ({
  visible,
  onCancel,
  onConfirm,
  auxTitle = "Descartar cambios",
  subtitle = "¿Quieres descartar los cambios realizados?",
  confirmButtonText = "Descartar cambios",
  cancelButtonText = "Seguir editando",
}) => {
  const reducedMotion = useReducedMotion();
  return (
    <Modal
      animationType={reducedMotion ? "none" : "fade"}
      onRequestClose={onCancel}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-center items-center p-6 bg-black/50">
        <TouchableWithoutFeedback accessible={false} onPress={onCancel}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>
        <View
          accessibilityViewIsModal
          className="p-3 w-full max-w-xs mx-auto"
          onAccessibilityEscape={onCancel}
          style={{
            borderRadius: 16,
            backgroundColor: theme.bg.popover,
            ...theme.shadow.md,
          }}
        >
          <Typography accessibilityRole="header" className="mb-1.5 text-sm" variant="body">
            <Typography semibold variant="body">
              {auxTitle}
            </Typography>
          </Typography>
          <Typography className="mb-3 text-xs leading-tight" variant="body">
            {subtitle}
          </Typography>
          <View className="flex-row gap-2">
            <BaseButton
              className="flex-1"
              onPress={onCancel}
              size="small"
              title={cancelButtonText}
              variant="outlineBlack"
            />
            <BaseButton
              className="flex-1"
              onPress={onConfirm}
              size="small"
              title={confirmButtonText}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationDialog;
