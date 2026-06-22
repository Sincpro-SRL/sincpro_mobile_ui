import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastVariant = "info" | "success" | "warning" | "danger" | "loading";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

type MessageOrFn<T> = string | ((value: T) => string);

export interface ToastPromiseMessages<T> {
  loading: string;
  success: MessageOrFn<T>;
  error: MessageOrFn<unknown>;
}

export interface ToastContextValue {
  show: (options: ToastOptions) => string;
  update: (id: string, options: Partial<ToastOptions>) => void;
  hide: (id: string) => void;
  info: (message: string, options?: Omit<ToastOptions, "message" | "variant">) => string;
  success: (message: string, options?: Omit<ToastOptions, "message" | "variant">) => string;
  warning: (message: string, options?: Omit<ToastOptions, "message" | "variant">) => string;
  danger: (message: string, options?: Omit<ToastOptions, "message" | "variant">) => string;
  loading: (message: string, options?: Omit<ToastOptions, "message" | "variant">) => string;
  promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => Promise<T>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3500;

const toast = tv({
  slots: {
    root: "flex-row items-center gap-3 rounded-lg px-4 py-3 bg-bg-card border-l-4 shadow-lg",
    title: "text-sm font-semibold text-text-primary",
    message: "text-sm text-text-secondary",
  },
  variants: {
    variant: {
      info: { root: "border-info" },
      success: { root: "border-success" },
      warning: { root: "border-warning" },
      danger: { root: "border-danger" },
      loading: { root: "border-primary" },
    },
  },
  defaultVariants: { variant: "info" },
});

const iconByVariant: Record<
  Exclude<ToastVariant, "loading">,
  { name: string; color: string }
> = {
  info: { name: "information-circle", color: theme.info },
  success: { name: "checkmark-circle", color: theme.success },
  warning: { name: "warning", color: theme.warning },
  danger: { name: "close-circle", color: theme.danger },
};

function ToastItem({ entry, onHide }: { entry: ToastEntry; onHide: (id: string) => void }) {
  const variant = entry.variant ?? "info";
  const styles = toast({ variant });

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessible
      className={styles.root()}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
    >
      {variant === "loading" ? (
        <ActivityIndicator color={theme.primary} size="small" />
      ) : (
        <Icon
          color={iconByVariant[variant].color}
          name={iconByVariant[variant].name}
          size={22}
        />
      )}
      <View className="flex-1">
        {entry.title ? (
          <Typography.Text className={styles.title()}>{entry.title}</Typography.Text>
        ) : null}
        <Typography.Text className={styles.message()}>{entry.message}</Typography.Text>
      </View>
      {entry.action ? (
        <Pressable
          accessibilityLabel={entry.action.label}
          onPress={() => {
            entry.action?.onPress();
            onHide(entry.id);
          }}
        >
          <Typography.Text className="text-primary text-sm font-semibold">
            {entry.action.label}
          </Typography.Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  const hide = useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      clearTimer(id);
    },
    [clearTimer],
  );

  const scheduleDismiss = useCallback(
    (id: string, variant: ToastVariant | undefined, duration: number | undefined) => {
      clearTimer(id);
      const resolved = duration ?? (variant === "loading" ? 0 : DEFAULT_DURATION);
      if (resolved > 0) {
        timers.current[id] = setTimeout(() => hide(id), resolved);
      }
    },
    [clearTimer, hide],
  );

  const show = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((prev) => [...prev, { ...options, id }]);
      scheduleDismiss(id, options.variant, options.duration);
      return id;
    },
    [scheduleDismiss],
  );

  const update = useCallback(
    (id: string, options: Partial<ToastOptions>) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...options } : t)));
      scheduleDismiss(id, options.variant, options.duration);
    },
    [scheduleDismiss],
  );

  const value = useMemo<ToastContextValue>(() => {
    const promise = <T,>(p: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> => {
      const id = show({ message: messages.loading, variant: "loading", duration: 0 });
      return p.then(
        (result) => {
          const msg = messages.success;
          update(id, {
            message: typeof msg === "function" ? msg(result) : msg,
            variant: "success",
            duration: DEFAULT_DURATION,
          });
          return result;
        },
        (err) => {
          const msg = messages.error;
          update(id, {
            message: typeof msg === "function" ? msg(err) : msg,
            variant: "danger",
            duration: DEFAULT_DURATION,
          });
          throw err;
        },
      );
    };

    return {
      show,
      update,
      hide,
      info: (message, options) => show({ ...options, message, variant: "info" }),
      success: (message, options) => show({ ...options, message, variant: "success" }),
      warning: (message, options) => show({ ...options, message, variant: "warning" }),
      danger: (message, options) => show({ ...options, message, variant: "danger" }),
      loading: (message, options) => show({ ...options, message, variant: "loading" }),
      promise,
    };
  }, [show, update, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        className="absolute left-0 right-0 px-4 gap-2 z-toast"
        pointerEvents="box-none"
        style={{ bottom: insets.bottom + 12 }}
      >
        {toasts.map((entry) => (
          <ToastItem entry={entry} key={entry.id} onHide={hide} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}
