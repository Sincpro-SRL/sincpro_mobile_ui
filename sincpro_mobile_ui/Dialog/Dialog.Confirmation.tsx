import React from "react";
import { Modal, TouchableWithoutFeedback, View } from "react-native";

import { BaseButton } from "../primitives/BaseButton";
import { theme } from "../theme";
import Typography from "../Typography/Typography.Text";

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
  auxTitle = "cambios",
  subtitle = "¿Estás seguro de que quieres descartar los cambios realizados?",
  confirmButtonText = "Sí",
  cancelButtonText = "No, continuar aquí",
}) => {
  return (
    <Modal animationType="fade" onRequestClose={onCancel} transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center p-6 bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="rounded-xl p-3 w-full max-w-xs mx-auto"
              style={{ backgroundColor: theme.bg.popover, ...theme.shadow.md }}
            >
              <Typography className="mb-1.5 text-sm" variant="body">
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationDialog;
