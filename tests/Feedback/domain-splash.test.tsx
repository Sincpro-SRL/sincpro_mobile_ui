import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import DomainSplashScreen from "@sincpro/mobile-ui/Feedback/Feedback.DomainSplashScreen";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, TextInput } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Pattern", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.GradientSurface", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, {}, children);
});

let changeMotion: (enabled: boolean) => void;
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: jest.fn() };
  });
  jest
    .spyOn(Animated, "loop")
    .mockReturnValue({ start: jest.fn(), stop: jest.fn(), reset: jest.fn() });
  jest.spyOn(Animated, "timing").mockImplementation(() => ({
    start: (callback) => callback?.({ finished: true }),
    stop: jest.fn(),
    reset: jest.fn(),
  }));
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

function Draft() {
  const [value, setValue] = useState("borrador");
  return <TextInput accessibilityLabel="Dato" onChangeText={setValue} value={value} />;
}

test("loading never invents completion or a determinate percentage", async () => {
  const onComplete = jest.fn();
  await render(
    <DomainSplashScreen domainName="Ventas" isLoading onComplete={onComplete} testID="splash">
      <Text>Contenido privado</Text>
    </DomainSplashScreen>,
  );
  await act(() => jest.advanceTimersByTime(10000));
  expect(onComplete).not.toHaveBeenCalled();
  expect(
    screen.getByRole("progressbar", { name: "Cargando Ventas" }).props.accessibilityValue,
  ).toBeUndefined();
  expect(screen.queryByText("¡Listo!")).toBeNull();
  expect(screen.queryByText("Contenido privado")).toBeNull();
  expect(
    screen.getByTestId("splash-content", { includeHiddenElements: true }).props.pointerEvents,
  ).toBe("none");
});

test("real completion waits for the minimum duration and notifies exactly once", async () => {
  const first = jest.fn();
  const latest = jest.fn();
  const { rerender } = await render(
    <DomainSplashScreen domainName="Ventas" isLoading onComplete={first} testID="splash">
      <Draft />
    </DomainSplashScreen>,
  );
  await act(() => jest.advanceTimersByTime(100));
  await rerender(
    <DomainSplashScreen
      domainName="Ventas"
      isLoading={false}
      onComplete={latest}
      testID="splash"
    >
      <Draft />
    </DomainSplashScreen>,
  );
  await act(() => jest.advanceTimersByTime(199));
  expect(latest).not.toHaveBeenCalled();
  expect(screen.getByTestId("splash-loading")).toBeTruthy();
  await act(() => jest.advanceTimersByTime(1));
  expect(latest).toHaveBeenCalledTimes(1);
  expect(first).not.toHaveBeenCalled();
  expect(screen.queryByTestId("splash-loading")).toBeNull();
  await act(() => jest.advanceTimersByTime(5000));
  expect(latest).toHaveBeenCalledTimes(1);
});

test("new loading cycles preserve mounted drafts and do not inherit completion", async () => {
  const onComplete = jest.fn();
  const { rerender } = await render(
    <DomainSplashScreen
      domainName="Ventas"
      isLoading={false}
      minDuration={0}
      onComplete={onComplete}
    >
      <Draft />
    </DomainSplashScreen>,
  );
  await fireEvent.changeText(screen.getByLabelText("Dato"), "sin perder");
  await rerender(
    <DomainSplashScreen domainName="Ventas" isLoading minDuration={0} onComplete={onComplete}>
      <Draft />
    </DomainSplashScreen>,
  );
  expect(
    screen.getByDisplayValue("sin perder", { includeHiddenElements: true }),
  ).toBeTruthy();
  await act(() => jest.advanceTimersByTime(5000));
  expect(onComplete).not.toHaveBeenCalled();
  await rerender(
    <DomainSplashScreen
      domainName="Ventas"
      isLoading={false}
      minDuration={0}
      onComplete={onComplete}
    >
      <Draft />
    </DomainSplashScreen>,
  );
  await act(() => jest.advanceTimersByTime(0));
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.getByDisplayValue("sin perder")).toBeTruthy();
});

test("unmount cancels the minimum-duration timer", async () => {
  const onComplete = jest.fn();
  const { rerender, unmount } = await render(
    <DomainSplashScreen domainName="Ventas" isLoading onComplete={onComplete}>
      <Text>App</Text>
    </DomainSplashScreen>,
  );
  await rerender(
    <DomainSplashScreen domainName="Ventas" isLoading={false} onComplete={onComplete}>
      <Text>App</Text>
    </DomainSplashScreen>,
  );
  await unmount();
  await act(() => jest.advanceTimersByTime(1000));
  expect(onComplete).not.toHaveBeenCalled();
});

test("an interrupted fade cannot complete after unmount", async () => {
  let finishFade: Parameters<Animated.CompositeAnimation["start"]>[0];
  const stop = jest.fn();
  jest.mocked(Animated.timing).mockImplementation(() => ({
    start: (callback) => {
      finishFade = callback;
    },
    stop,
    reset: jest.fn(),
  }));
  const onComplete = jest.fn();
  const { rerender, unmount } = await render(
    <DomainSplashScreen domainName="Ventas" isLoading minDuration={0} onComplete={onComplete}>
      <Text>App</Text>
    </DomainSplashScreen>,
  );
  await act(() => changeMotion(false));
  await rerender(
    <DomainSplashScreen
      domainName="Ventas"
      isLoading={false}
      minDuration={0}
      onComplete={onComplete}
    >
      <Text>App</Text>
    </DomainSplashScreen>,
  );
  await act(() => jest.advanceTimersByTime(0));
  expect(Animated.timing).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ duration: 400, isInteraction: false }),
  );
  await unmount();
  expect(stop).toHaveBeenCalled();
  await act(() => finishFade?.({ finished: true }));
  expect(onComplete).not.toHaveBeenCalled();
});

test("custom loading renderer and native styles preserve the lifecycle contract", async () => {
  await render(
    <DomainSplashScreen
      containerStyle={{ marginTop: 12 }}
      domainName="Ventas"
      isLoading
      overlayStyle={{ borderRadius: 20 }}
      renderLoading={(state) => (
        <Text>{`${state.domainName}:${state.isLoading}:${state.reducedMotion}`}</Text>
      )}
      testID="custom"
    >
      <Draft />
    </DomainSplashScreen>,
  );
  expect(screen.getByText("Ventas:true:true")).toBeTruthy();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(StyleSheet.flatten(screen.getByTestId("custom").props.style).marginTop).toBe(12);
  expect(
    StyleSheet.flatten(screen.getByTestId("custom-loading").props.style).borderRadius,
  ).toBe(20);
});

test.each([-1, Infinity, NaN])(
  "invalid minimum duration %s is rejected",
  async (minDuration) => {
    await expect(
      render(
        <DomainSplashScreen domainName="Ventas" isLoading minDuration={minDuration}>
          <Text>App</Text>
        </DomainSplashScreen>,
      ),
    ).rejects.toThrow("minDuration");
  },
);
