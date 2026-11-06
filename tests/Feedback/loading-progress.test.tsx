import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Loading from "@sincpro/mobile-ui/Feedback/Feedback.Loading";
import Progress from "@sincpro/mobile-ui/Feedback/Feedback.Progress";
import ProgressCircle from "@sincpro/mobile-ui/Feedback/Feedback.ProgressCircle";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import Spinner from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { normalizeProgress } from "@sincpro/mobile-ui/utils/progress";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { act, render, renderHook, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Animated, StyleSheet } from "react-native";
import { cancelAnimation, withRepeat } from "react-native-reanimated";
import type { TestInstance } from "test-renderer";

jest.mock("react-native-svg", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: View,
    Circle: (props: object) => React.createElement(View, { ...props, testID: "mock-circle" }),
  };
});

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  const { useRef } = jest.requireActual<typeof import("react")>("react");
  return {
    __esModule: true,
    default: { View },
    Easing: { quad: "quad", in: () => "in", out: () => "out" },
    useSharedValue: (value: number) => useRef({ value }).current,
    useAnimatedStyle: (getStyle: () => object) => getStyle(),
    withTiming: (value: number) => value,
    withSequence: (...values: number[]) => values[values.length - 1],
    withDelay: (_delay: number, value: number) => value,
    withRepeat: jest.fn((value: number) => value),
    cancelAnimation: jest.fn(),
  };
});

let changeMotion: (enabled: boolean) => void;
const removeListener = jest.fn();
const startLoop = jest.fn();
const stopLoop = jest.fn();

function elementChild(parent: TestInstance): TestInstance {
  const child = parent.children[0];
  if (!child || typeof child === "string") throw new Error("Expected an element child");
  return child;
}

function nativeIndicators() {
  return screen.container.queryAll(
    (node) => node.props.color !== undefined && node.props.size !== undefined,
  );
}

beforeEach(() => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: removeListener };
  });
  jest.spyOn(Animated, "loop").mockReturnValue({
    start: startLoop,
    stop: stopLoop,
    reset: jest.fn(),
  });
  jest.spyOn(Animated, "timing");
});

afterEach(async () => {
  await act(() => setActiveTheme(DEFAULT_THEME));
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("motion preference starts safely, reads the system and updates live", async () => {
  let resolvePreference!: (enabled: boolean) => void;
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockReturnValue(
    new Promise<boolean>((resolve) => {
      resolvePreference = resolve;
    }),
  );
  const { result, unmount } = await renderHook(useReducedMotion);
  expect(result.current).toBe(true);
  await act(() => resolvePreference(false));
  expect(result.current).toBe(false);
  await act(() => changeMotion(true));
  expect(result.current).toBe(true);
  await unmount();
  expect(removeListener).toHaveBeenCalledTimes(1);
});

test("a late initial query cannot overwrite a newer setting event", async () => {
  let resolvePreference!: (enabled: boolean) => void;
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockReturnValue(
    new Promise<boolean>((resolve) => {
      resolvePreference = resolve;
    }),
  );
  const { result } = await renderHook(useReducedMotion);
  await act(() => changeMotion(true));
  await act(() => resolvePreference(false));
  expect(result.current).toBe(true);
});

test("preference lookup failures are logged and keep motion disabled", async () => {
  const failure = new Error("Preference unavailable");
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockRejectedValue(failure);
  const { result } = await renderHook(useReducedMotion);
  expect(result.current).toBe(true);
  expect(warn).toHaveBeenCalledWith(
    "[useReducedMotion] Could not read accessibility preference",
    failure,
  );
});

test("unmount ignores pending preference results", async () => {
  let resolvePreference!: (enabled: boolean) => void;
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockReturnValue(
    new Promise<boolean>((resolve) => {
      resolvePreference = resolve;
    }),
  );
  const { result, unmount } = await renderHook(useReducedMotion);
  await unmount();
  await act(() => resolvePreference(false));
  expect(result.current).toBe(true);
  expect(removeListener).toHaveBeenCalledTimes(1);
});

test("skeleton stops its pulse live and stays hidden from screen readers", async () => {
  const { unmount } = await render(<Skeleton height={24} testID="placeholder" />);
  expect(startLoop).toHaveBeenCalledTimes(1);
  for (const [, config] of jest.mocked(Animated.timing).mock.calls)
    expect(config.isInteraction).toBe(false);
  await act(() => changeMotion(true));
  expect(stopLoop).toHaveBeenCalledTimes(1);
  const placeholder = screen.getByTestId("placeholder", { includeHiddenElements: true });
  expect(StyleSheet.flatten(placeholder.props.style).opacity).toBe(0.5);
  expect(placeholder.props.importantForAccessibility).toBe("no-hide-descendants");
  await act(() => changeMotion(false));
  expect(startLoop).toHaveBeenCalledTimes(2);
  await unmount();
  expect(stopLoop).toHaveBeenCalledTimes(2);
});

test("explicit animation opt-out remains static even when system motion is enabled", async () => {
  await render(<Skeleton animated={false} testID="static-placeholder" />);
  expect(startLoop).not.toHaveBeenCalled();
  await act(() => changeMotion(false));
  expect(startLoop).not.toHaveBeenCalled();
});

test("system motion preference takes precedence over animated=true", async () => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
  await render(<Skeleton animated testID="system-static" />);
  expect(startLoop).not.toHaveBeenCalled();
});

test.each([-1, 0, 0.25, 1, 2])(
  "both progress shapes clamp finite value %s consistently",
  async (value) => {
    await render(
      <>
        <Progress accessibilityLabel="Descarga" testID="linear" value={value} />
        <ProgressCircle accessibilityLabel="Subida" testID="circular" value={value} />
      </>,
    );
    const normalized = normalizeProgress(value);
    for (const label of ["Descarga", "Subida"]) {
      expect(
        screen.getByRole("progressbar", { name: label }).props.accessibilityValue,
      ).toEqual({
        min: 0,
        max: 100,
        now: Math.round(normalized * 100),
      });
    }
    const linear = screen.getByTestId("linear");
    expect(StyleSheet.flatten(elementChild(linear).props.style).width).toBe(
      `${normalized * 100}%`,
    );
    const circles = screen.getAllByTestId("mock-circle");
    const radius = (64 - 6) / 2;
    expect(circles[1].props.strokeDashoffset).toBeCloseTo(
      2 * Math.PI * radius * (1 - normalized),
    );
  },
);

test.each([NaN, Infinity, -Infinity])(
  "non-finite progress %s is rejected explicitly",
  (value) => {
    expect(() => normalizeProgress(value)).toThrow("Progress value must be a finite number");
  },
);

test("indeterminate progress has no invented percent and retains a static busy marker", async () => {
  await render(
    <Progress
      accessibilityLabel="Sincronizando"
      animated={false}
      indeterminate
      testID="pending"
    />,
  );
  const progress = screen.getByRole("progressbar", { name: "Sincronizando" });
  expect(progress.props.accessibilityValue).toBeUndefined();
  expect(progress.props.accessibilityState).toEqual({ busy: true });
  expect(StyleSheet.flatten(elementChild(progress).props.style)).toMatchObject({
    width: "40%",
    marginLeft: "30%",
    transform: [],
  });
  expect(startLoop).not.toHaveBeenCalled();
});

test("indeterminate progress stops/restarts live and stops on switching to determinate", async () => {
  const { rerender } = await render(<Progress indeterminate testID="progress" />);
  expect(startLoop).toHaveBeenCalledTimes(1);
  expect(jest.mocked(Animated.timing).mock.calls[0][1].isInteraction).toBe(false);
  await act(() => changeMotion(true));
  expect(stopLoop).toHaveBeenCalledTimes(1);
  await act(() => changeMotion(false));
  expect(startLoop).toHaveBeenCalledTimes(2);
  await rerender(<Progress testID="progress" value={0.75} />);
  expect(stopLoop).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId("progress").props.accessibilityState.busy).toBe(false);
});

test("linear progress exposes surface and indicator styling without replacing behavior", async () => {
  await render(
    <Progress
      accessibilityLabel="Exportación"
      indicatorStyle={{ backgroundColor: "#123ABC", borderRadius: 0 }}
      style={{ height: 12, backgroundColor: "#EEEEEE" }}
      value={0.4}
    />,
  );
  const progress = screen.getByRole("progressbar", { name: "Exportación" });
  expect(StyleSheet.flatten(progress.props.style)).toMatchObject({
    height: 12,
    backgroundColor: "#EEEEEE",
  });
  expect(StyleSheet.flatten(elementChild(progress).props.style)).toMatchObject({
    width: "40%",
    backgroundColor: "#123ABC",
    borderRadius: 0,
  });
});

test.each(["spinner", "dots", "ripple"] as const)(
  "static %s retains an accessible loading state",
  async (variant) => {
    await render(
      <Spinner animated={false} testID="busy" text="Preparando archivo" variant={variant} />,
    );
    const spinner = screen.getByRole("progressbar", { name: "Preparando archivo" });
    expect(spinner.props.accessibilityState).toEqual({ busy: true });
    expect(spinner.props.accessibilityValue).toBeUndefined();
    expect(screen.queryAllByRole("progressbar")).toHaveLength(1);
    expect(nativeIndicators()).toHaveLength(0);
    expect(withRepeat).not.toHaveBeenCalled();
  },
);

test.each(["dots", "ripple"] as const)(
  "%s cancels repeated animation on preference change and unmount",
  async (variant) => {
    const { unmount } = await render(<Spinner variant={variant} />);
    expect(withRepeat).toHaveBeenCalled();
    await act(() => changeMotion(true));
    expect(cancelAnimation).toHaveBeenCalledTimes(variant === "dots" ? 3 : 2);
    await act(() => changeMotion(false));
    await unmount();
    expect(cancelAnimation).toHaveBeenCalledTimes(variant === "dots" ? 6 : 4);
  },
);

test("native spinner respects live motion settings and explicit accessible names", async () => {
  await render(<Spinner accessibilityLabel="Cargando datos" text="Espera" />);
  expect(nativeIndicators()).toHaveLength(1);
  expect(screen.getByRole("progressbar", { name: "Cargando datos" })).toBeTruthy();
  await act(() => changeMotion(true));
  expect(nativeIndicators()).toHaveLength(0);
});

test("loading forwards animation, label and test ID to its indicator", async () => {
  await render(
    <Loading
      accessibilityLabel="Loading records"
      animated={false}
      message="Cargando registros"
      testID="loading"
      variant="dots"
    />,
  );
  expect(screen.getByRole("progressbar", { name: "Loading records" }).props.testID).toBe(
    "loading",
  );
  expect(withRepeat).not.toHaveBeenCalled();
});

test("spinner and circular progress follow live theme colors and preserve explicit overrides", async () => {
  await render(
    <>
      <Spinner animated={false} />
      <ProgressCircle testID="default-circle" />
      <ProgressCircle color="#123ABC" testID="custom-circle" trackColor="#ABC123" />
    </>,
  );
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  const circles = screen.getAllByTestId("mock-circle");
  expect(circles[0].props.stroke).toBe(DEFAULT_DARK_THEME.bg.muted);
  expect(circles[1].props.stroke).toBe(DEFAULT_DARK_THEME.primary);
  expect(circles[2].props.stroke).toBe("#ABC123");
  expect(circles[3].props.stroke).toBe("#123ABC");
  const spinner = screen.getByRole("progressbar", { name: "Cargando" });
  expect(
    StyleSheet.flatten(elementChild(elementChild(spinner)).props.style).borderColor,
  ).toBe(DEFAULT_DARK_THEME.primary);
});
