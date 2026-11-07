import Confirmation, {
  type ConfirmationProps,
} from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type { NativeConfirmationOptions } from "@sincpro/mobile-ui/Dialog/requestConfirmation";
export { requestConfirmation } from "@sincpro/mobile-ui/Dialog/requestConfirmation";

export type ConfirmationOptions = Omit<ConfirmationProps, "visible" | "onClose">;

type ConfirmationContextValue = {
  show: (options: ConfirmationOptions) => void;
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmationOptions>();
  const [visible, setVisible] = useState(false);
  const show = useCallback(
    ({
      title = "Confirmación",
      message = "¿Estás seguro de que quieres continuar?",
      confirmText = "Confirmar",
      cancelText = "Cancelar",
      destructive = false,
      ...next
    }: ConfirmationOptions) => {
      setOptions({ title, message, confirmText, cancelText, destructive, ...next });
      setVisible(true);
    },
    [],
  );
  const value = useMemo(() => ({ show }), [show]);

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      {options ? (
        <Confirmation {...options} onClose={() => setVisible(false)} visible={visible} />
      ) : null}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmationContext() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmationContext requires ConfirmationProvider.");
  }
  return context;
}
