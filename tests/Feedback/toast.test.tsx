import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { Toast, ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback/Toast.context";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode, useRef } from "react";
import { AccessibilityInfo, Button, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const { useRef } = jest.requireActual<typeof import("react")>("react");
  const transition = { duration: () => ({}) };

  return {
    __esModule: true,
    default: { View },
    FadeInDown: transition,
    FadeInUp: transition,
    FadeOutDown: transition,
    FadeOutUp: transition,
    Easing: { quad: "quad", in: () => "in", out: () => "out" },
    useSharedValue: (value: number) => useRef({ value }).current,
    useAnimatedStyle: (getStyle: () => object) => getStyle(),
    withTiming: (value: number) => value,
    withSequence: (...values: number[]) => values[values.length - 1],
    withRepeat: (value: number) => value,
    cancelAnimation: jest.fn(),
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

let changeMotion: (enabled: boolean) => void;
beforeEach(() => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: jest.fn() };
  });
});
afterEach(() => {
  jest.restoreAllMocks();
});

interface PanGestureEndEvent {
  canceled: boolean;
  translationY: number;
  velocityY: number;
}

interface PanGestureConfig {
  onDeactivate?: (event: PanGestureEndEvent) => void;
}

jest.mock("react-native-gesture-handler", () => {
  const config = { current: undefined as PanGestureConfig | undefined };

  return {
    __esModule: true,
    GestureDetector: ({ children }: { children: ReactNode }) => children,
    usePanGesture: (gestureConfig: PanGestureConfig) => {
      config.current = gestureConfig;
      return gestureConfig;
    },
    __mockConfig: config,
  };
});

function renderWithToastProvider(children: ReactNode) {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, right: 0, bottom: 0, left: 0 },
      }}
    >
      <ToastProvider>{children}</ToastProvider>
    </SafeAreaProvider>,
  );
}

function ToastTimerControls() {
  const toast = useToast();
  const id = useRef<string | null>(null);

  return (
    <>
      <Button
        onPress={() => {
          id.current = toast.loading("En cola");
          toast.update(id.current, { message: "Procesando" });
        }}
        title="Iniciar"
      />
      <Button
        onPress={() =>
          id.current &&
          toast.update(id.current, {
            duration: 1000,
            message: "Completado",
            variant: "success",
          })
        }
        title="Completar"
      />
    </>
  );
}

function CustomToastTrigger() {
  const toast = useToast();

  return (
    <Button
      onPress={() =>
        toast.show({
          render: ({ dismiss }) => (
            <>
              <Toast.Icon variant="success" />
              <Toast.Content>
                <Toast.Title>Pedido listo</Toast.Title>
                <Toast.Description>Se sincronizó correctamente</Toast.Description>
              </Toast.Content>
              <Toast.Action label="Ver" onPress={dismiss} />
              <Toast.Close onPress={dismiss} />
            </>
          ),
        })
      }
      title="Mostrar compuesto"
    />
  );
}

function ToastSwipeControls() {
  const toast = useToast();
  return <Button onPress={() => toast.info("Desliza para cerrar")} title="Mostrar swipe" />;
}

test("partial updates preserve the loading lifetime and apply the new duration", async () => {
  jest.useFakeTimers();
  try {
    await renderWithToastProvider(<ToastTimerControls />);
    await fireEvent.press(screen.getByRole("button", { name: "Iniciar" }));
    expect(screen.getByText("Procesando")).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(5000));
    expect(screen.getByText("Procesando")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Completar" }));
    await act(async () => jest.advanceTimersByTime(999));
    expect(screen.getByText("Completado")).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(1));
    expect(screen.queryByText("Completado")).toBeNull();
  } finally {
    jest.useRealTimers();
  }
});

test("custom render composes the shared toast slots and actions", async () => {
  await renderWithToastProvider(<CustomToastTrigger />);
  await fireEvent.press(screen.getByRole("button", { name: "Mostrar compuesto" }));

  expect(screen.getByText("Pedido listo")).toBeTruthy();
  expect(screen.getByText("Se sincronizó correctamente")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Ver" }));
  expect(screen.queryByText("Pedido listo")).toBeNull();
});

test("swiping the toast up or down dismisses it", async () => {
  await renderWithToastProvider(<ToastSwipeControls />);

  const gestureMock = jest.requireMock("react-native-gesture-handler") as {
    __mockConfig: { current?: PanGestureConfig };
  };

  await fireEvent.press(screen.getByRole("button", { name: "Mostrar swipe" }));
  await act(async () =>
    gestureMock.__mockConfig.current?.onDeactivate?.({
      canceled: false,
      translationY: -56,
      velocityY: 0,
    }),
  );
  expect(screen.queryByText("Desliza para cerrar")).toBeNull();

  await fireEvent.press(screen.getByRole("button", { name: "Mostrar swipe" }));
  await act(async () =>
    gestureMock.__mockConfig.current?.onDeactivate?.({
      canceled: false,
      translationY: 56,
      velocityY: 0,
    }),
  );
  expect(screen.queryByText("Desliza para cerrar")).toBeNull();
});

test("toast transitions follow live reduced motion and root native customization", async () => {
  await render(
    <Toast.Root onAccessibilityEscape={jest.fn()} style={{ borderRadius: 30 }} testID="toast">
      <Text>Guardado</Text>
    </Toast.Root>,
  );
  expect(screen.getByTestId("toast").props.entering).toBeDefined();
  await act(() => changeMotion(true));
  expect(screen.getByTestId("toast").props.entering).toBeUndefined();
  expect(screen.getByTestId("toast").props.exiting).toBeUndefined();
  expect(StyleSheet.flatten(screen.getByTestId("toast").props.style).borderRadius).toBe(30);
});

test("auto-dismissing toasts have a visible close alternative by default", async () => {
  await renderWithToastProvider(<ToastSwipeControls />);
  await fireEvent.press(screen.getByRole("button", { name: "Mostrar swipe" }));
  const close = screen.getByRole("button", { name: "Cerrar" });
  expect(StyleSheet.flatten(close.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(close);
  expect(screen.queryByText("Desliza para cerrar")).toBeNull();
});

test("native accessibility Escape dismisses a default toast", async () => {
  await renderWithToastProvider(<ToastSwipeControls />);
  await fireEvent.press(screen.getByRole("button", { name: "Mostrar swipe" }));
  const surface = screen.container
    .queryAll((node) => node.props.accessibilityRole === "alert")
    .at(-1);
  if (!surface) throw new Error("Expected the native toast alert surface.");
  await fireEvent(surface, "accessibilityEscape");
  expect(screen.queryByText("Desliza para cerrar")).toBeNull();
});

test("custom action geometry and native disabled state preserve the interaction contract", async () => {
  const onPress = jest.fn();
  const { rerender } = await render(
    <Toast.Action disabled label="Deshacer" onPress={onPress} style={{ borderRadius: 18 }} />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Deshacer" }));
  expect(onPress).not.toHaveBeenCalled();
  await rerender(
    <Toast.Action label="Deshacer" onPress={onPress} style={{ borderRadius: 18 }} />,
  );
  const action = screen.getByRole("button", { name: "Deshacer" });
  expect(StyleSheet.flatten(action.props.style)).toMatchObject({
    minHeight: 48,
    minWidth: 48,
    borderRadius: 18,
  });
  await fireEvent.press(action);
  expect(onPress).toHaveBeenCalledTimes(1);
});
