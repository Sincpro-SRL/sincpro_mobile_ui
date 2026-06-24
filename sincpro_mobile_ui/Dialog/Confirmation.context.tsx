import { BottomSheet } from "@sincpro/mobile-ui/Dialog/BottomSheet";
import ConfirmationDialog from "@sincpro/mobile-ui/Dialog/Dialog.Confirmation";
import { BaseButton } from "@sincpro/mobile-ui/primitives/BaseButton";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ConfirmationVariant = "dialog" | "bottomSheet";

interface IConfirmationOptions {
  variant?: ConfirmationVariant;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  render?: (close: () => void) => ReactNode;
}

interface IConfirmationState extends IConfirmationOptions {
  isVisible: boolean;
}

type ConfirmationContextValue = {
  show: (opts: IConfirmationOptions) => void;
  hide: () => void;
};

const DEFAULT_STATE: IConfirmationState = {
  isVisible: false,
  variant: "dialog",
  title: "Confirmación",
  message: "¿Estás seguro de que quieres continuar?",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  onConfirm: undefined,
  onCancel: undefined,
  render: undefined,
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IConfirmationState>(DEFAULT_STATE);

  const show = useCallback((opts: IConfirmationOptions) => {
    setState((prev) => ({
      ...prev,
      isVisible: true,
      variant: opts.variant ?? DEFAULT_STATE.variant,
      title: opts.title ?? DEFAULT_STATE.title,
      message: opts.message ?? DEFAULT_STATE.message,
      confirmText: opts.confirmText ?? DEFAULT_STATE.confirmText,
      cancelText: opts.cancelText ?? DEFAULT_STATE.cancelText,
      onConfirm: opts.onConfirm,
      onCancel: opts.onCancel,
      render: opts.render,
    }));
  }, []);

  const hide = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  const handleConfirm = async () => {
    try {
      await state.onConfirm?.();
    } finally {
      hide();
    }
  };

  const handleCancel = async () => {
    try {
      await state.onCancel?.();
    } finally {
      hide();
    }
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}

      {state.variant === "dialog" && (
        <ConfirmationDialog
          auxTitle={state.title}
          cancelButtonText={state.cancelText}
          confirmButtonText={state.confirmText}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          subtitle={state.message}
          visible={state.isVisible}
        />
      )}

      {state.variant === "bottomSheet" && (
        <BottomSheet.Root onClose={handleCancel} visible={state.isVisible}>
          {state.render ? (
            state.render(hide)
          ) : (
            <>
              <BottomSheet.Header>
                <BottomSheet.Title subtitle={state.message}>{state.title}</BottomSheet.Title>
              </BottomSheet.Header>
              <BottomSheet.Actions layout="horizontal">
                <BaseButton
                  className="flex-1"
                  onPress={handleCancel}
                  title={state.cancelText ?? ""}
                  variant="outline"
                />
                <BaseButton
                  className="flex-1"
                  onPress={handleConfirm}
                  title={state.confirmText ?? ""}
                  variant="primary"
                />
              </BottomSheet.Actions>
            </>
          )}
        </BottomSheet.Root>
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmationContext() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    return { show: () => {}, hide: () => {} };
  }
  return context;
}
