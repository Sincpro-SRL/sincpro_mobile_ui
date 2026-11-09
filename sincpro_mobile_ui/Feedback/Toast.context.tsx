import { OverlayPortal } from "@sincpro/mobile-ui/Dialog/OverlayHost";
import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Spinner from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import Pressable, { type PressableProps } from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type StyleProp, View, type ViewProps, type ViewStyle } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

export type ToastVariant = "info" | "success" | "warning" | "danger" | "loading";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastRenderProps {
  id: string;
  dismiss: () => void;
  update: (options: Partial<ToastOptions>) => void;
}

export interface ToastOptions {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  className?: string;
  render?: (controls: ToastRenderProps) => ReactNode;
  /** Stable id: calling show()/info()/… again with the same id updates the existing toast
   *  (and resets its timer) instead of stacking a duplicate. */
  id?: string;
  /** Render a close (✕) button. Defaults to true, including auto-dismissing toasts. */
  dismissible?: boolean;
}

export type ToastCustomOptions = Omit<ToastOptions, "message" | "render"> & {
  message?: string;
  render: (controls: ToastRenderProps) => ReactNode;
};

interface ToastEntry extends ToastOptions {
  id: string;
}

export interface ToastRootProps extends Omit<ViewProps, "children"> {
  children: ReactNode;
  accessibilityHint?: string;
  className?: string;
  position?: "top" | "bottom";
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function ToastRoot({
  children,
  accessibilityHint = "Usa Cerrar o desliza hacia arriba o abajo para cerrar",
  className,
  position = "top",
  style,
  testID,
  ...viewProps
}: ToastRootProps) {
  const reducedMotion = useReducedMotion();
  const styles = toast();
  const entering = position === "top" ? FadeInDown : FadeInUp;
  const exiting = position === "top" ? FadeOutUp : FadeOutDown;

  return (
    <Animated.View
      {...viewProps}
      accessibilityHint={accessibilityHint}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className={styles.root({ className })}
      entering={reducedMotion ? undefined : entering.duration(220)}
      exiting={reducedMotion ? undefined : exiting.duration(180)}
      style={style}
      testID={testID}
    >
      {children}
    </Animated.View>
  );
}

export interface ToastIconProps {
  variant?: ToastVariant;
  icon?: ReactNode;
  color?: string;
  size?: number;
}

function ToastIcon({ variant = "info", icon, color, size = 22 }: ToastIconProps) {
  const theme = useTheme();
  if (icon) return <>{icon}</>;
  if (variant === "loading") {
    return (
      <Spinner
        accessibilityLabel="Cargando"
        color={color ?? theme.text.accent}
        size="small"
      />
    );
  }
  const colors = {
    info: theme.info,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
  };
  return <Icon color={color ?? colors[variant]} name={iconByVariant[variant]} size={size} />;
}

export interface ToastContentProps {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

function ToastContent({ children, className, style }: ToastContentProps) {
  return (
    <View className={cn("flex-1", className)} style={style}>
      {children}
    </View>
  );
}

export interface ToastTextProps {
  children: ReactNode;
  className?: string;
}

function ToastTitle({ children, className }: ToastTextProps) {
  return (
    <Typography.Text className={cn("text-text-primary", className)}>
      {children}
    </Typography.Text>
  );
}

function ToastDescription({ children, className }: ToastTextProps) {
  return (
    <Typography.Text className={cn("text-text-secondary", className)}>
      {children}
    </Typography.Text>
  );
}

export interface ToastActionProps extends Omit<PressableProps, "children" | "onPress"> {
  label: string;
  onPress: () => void;
  className?: string;
}

function ToastActionButton({ label, onPress, className, style, ...props }: ToastActionProps) {
  return (
    <Pressable
      {...props}
      accessibilityLabel={label}
      accessibilityRole="button"
      className={cn("min-h-12 justify-center px-2", className)}
      onPress={onPress}
      style={[{ minHeight: 48, minWidth: 48 }, style]}
    >
      <Typography.Text className="text-text-accent">{label}</Typography.Text>
    </Pressable>
  );
}

export interface ToastCloseProps extends Omit<PressableProps, "children" | "onPress"> {
  onPress: () => void;
  accessibilityLabel?: string;
  className?: string;
}

function ToastClose({
  onPress,
  accessibilityLabel = "Cerrar",
  className,
  style,
  ...props
}: ToastCloseProps) {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={cn("min-h-12 min-w-12 items-center justify-center", className)}
      hitSlop={8}
      onPress={onPress}
      style={[{ minHeight: 48, minWidth: 48 }, style]}
    >
      <Icon color={theme.text.tertiary} name="close" size={18} />
    </Pressable>
  );
}

export const Toast = {
  Root: ToastRoot,
  Icon: ToastIcon,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastActionButton,
  Close: ToastClose,
};

type MessageOrFn<T> = string | ((value: T) => string);

export interface ToastPromiseMessages<T> {
  loading: string;
  success: MessageOrFn<T>;
  error: MessageOrFn<unknown>;
}

export interface ToastContextValue {
  show: (options: ToastOptions | ToastCustomOptions) => string;
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

// iOS-style card: rounded, hairline border + soft shadow, neutral surface. The variant is
// conveyed by the colored icon (no left-accent stripe — it doesn't read well on iOS).
const toast = tv({
  slots: {
    root: "flex-row items-center gap-3 rounded-2xl px-4 py-3 bg-bg-card border border-border-light shadow-lg",
    title: "text-sm font-semibold text-text-primary",
    message: "text-sm text-text-secondary",
  },
});

const iconByVariant: Record<Exclude<ToastVariant, "loading">, IconName> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "dismiss",
};

function ToastItem({
  entry,
  onHide,
  onUpdate,
  position,
}: {
  entry: ToastEntry;
  onHide: (id: string) => void;
  onUpdate: (id: string, options: Partial<ToastOptions>) => void;
  position: "top" | "bottom";
}) {
  const variant = entry.variant ?? "info";
  const showClose = entry.dismissible ?? true;
  const dismiss = () => onHide(entry.id);
  // The worklets plugin moves this callback to the UI thread. Calling `dismiss` there is a
  // fatal error in release builds (the app closed on a swipe), so it hops back to JS.
  const pan = usePanGesture({
    activeOffsetY: [-12, 12],
    failOffsetX: [-24, 24],
    onDeactivate: ({ canceled, translationY, velocityY }) => {
      "worklet";
      if (!canceled && (Math.abs(translationY) >= 48 || Math.abs(velocityY) >= 800)) {
        scheduleOnRN(dismiss);
      }
    },
  });

  return (
    <GestureDetector gesture={pan}>
      <Toast.Root
        className={entry.className}
        onAccessibilityEscape={dismiss}
        position={position}
      >
        {entry.render ? (
          entry.render({
            dismiss,
            id: entry.id,
            update: (options) => onUpdate(entry.id, options),
          })
        ) : (
          <>
            <Toast.Icon variant={variant} />
            <Toast.Content>
              {entry.title ? <Toast.Title>{entry.title}</Toast.Title> : null}
              {entry.message ? <Toast.Description>{entry.message}</Toast.Description> : null}
            </Toast.Content>
            {entry.action ? (
              <Toast.Action
                label={entry.action.label}
                onPress={() => {
                  entry.action?.onPress();
                  dismiss();
                }}
              />
            ) : null}
            {showClose ? <Toast.Close onPress={dismiss} /> : null}
          </>
        )}
      </Toast.Root>
    </GestureDetector>
  );
}

export function ToastProvider({
  children,
  position = "bottom",
}: {
  children: ReactNode;
  position?: "top" | "bottom";
}) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const toastsRef = useRef<ToastEntry[]>([]);
  const counter = useRef(0);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const commitToasts = useCallback((next: ToastEntry[]) => {
    toastsRef.current = next;
    setToasts(next);
  }, []);

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current[id];
    if (timer !== undefined) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  const hide = useCallback(
    (id: string) => {
      commitToasts(toastsRef.current.filter((t) => t.id !== id));
      clearTimer(id);
    },
    [clearTimer, commitToasts],
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
    (options: ToastOptions | ToastCustomOptions) => {
      let id = options.id;
      if (!id) {
        counter.current += 1;
        id = `toast-${counter.current}`;
      }
      const toastId = id;
      const current = toastsRef.current;
      const currentEntry = current.find((entry) => entry.id === toastId);
      const nextEntry: ToastEntry = {
        ...currentEntry,
        ...options,
        id: toastId,
        message: options.message ?? currentEntry?.message ?? "",
      };
      commitToasts(
        currentEntry
          ? current.map((entry) => (entry.id === toastId ? nextEntry : entry))
          : [...current, nextEntry],
      );
      scheduleDismiss(toastId, nextEntry.variant, nextEntry.duration);
      return toastId;
    },
    [commitToasts, scheduleDismiss],
  );

  const update = useCallback(
    (id: string, options: Partial<ToastOptions>) => {
      const current = toastsRef.current.find((entry) => entry.id === id);
      if (!current) return;
      const updated = { ...current, ...options, id };
      commitToasts(toastsRef.current.map((entry) => (entry.id === id ? updated : entry)));
      scheduleDismiss(id, updated.variant, updated.duration);
    },
    [commitToasts, scheduleDismiss],
  );

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    },
    [],
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
      <OverlayPortal layer="toast">
        <View
          className="absolute left-0 right-0 px-4 gap-2 z-toast"
          pointerEvents="box-none"
          style={
            position === "top" ? { top: insets.top + 12 } : { bottom: insets.bottom + 12 }
          }
        >
          {toasts.map((entry) => (
            <ToastItem
              entry={entry}
              key={entry.id}
              onHide={hide}
              onUpdate={update}
              position={position}
            />
          ))}
        </View>
      </OverlayPortal>
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
