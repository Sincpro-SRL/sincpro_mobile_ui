import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { DialogActions } from "@sincpro/mobile-ui/Dialog/dialog-actions";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";
import { type ReactNode, useRef, useState } from "react";

export type ConfirmationProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  children?: ReactNode;
  testID?: string;
};

function Confirmation({
  visible,
  onClose,
  onConfirm,
  title = "Descartar cambios",
  message = "¿Quieres descartar los cambios realizados?",
  confirmText = "Descartar cambios",
  cancelText = "Seguir editando",
  destructive = true,
  children,
  testID,
}: ConfirmationProps) {
  const saving = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const close = () => {
    if (saving.current) return;
    setError(undefined);
    onClose();
  };
  const confirm = async () => {
    if (saving.current) return;
    saving.current = true;
    setPending(true);
    setError(undefined);
    const result = await attempt(async () => {
      await onConfirm();
      onClose();
    });
    saving.current = false;
    setPending(false);
    if (!result.ok) {
      setError(
        errorMessage(result.error, "No se pudo completar la operación. Vuelve a intentarlo."),
      );
    }
  };

  return (
    <Sheet
      dismissible={!pending}
      footer={
        <DialogActions
          cancel={{ disabled: pending, onPress: close, title: cancelText }}
          confirm={{
            disabled: pending,
            loading: pending,
            onPress: () => void confirm(),
            title: confirmText,
          }}
          confirmVariant={destructive ? "outlineDanger" : "primary"}
        />
      }
      onClose={close}
      testID={testID}
      title={title}
      visible={visible}
    >
      <Typography.Text className="text-text-secondary" selectable>
        {message}
      </Typography.Text>
      {children}
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
  );
}

export default Confirmation;
