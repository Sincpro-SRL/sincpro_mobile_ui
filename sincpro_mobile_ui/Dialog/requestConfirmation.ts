import type { ConfirmationProps } from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import { Alert } from "react-native";

export type NativeConfirmationOptions = Pick<
  ConfirmationProps,
  "title" | "message" | "confirmText" | "cancelText" | "destructive"
>;

export function requestConfirmation({
  title = "Confirmación",
  message = "¿Estás seguro de que quieres continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  destructive = false,
}: NativeConfirmationOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: "cancel", onPress: () => resolve(false) },
        {
          text: confirmText,
          style: destructive ? "destructive" : "default",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
