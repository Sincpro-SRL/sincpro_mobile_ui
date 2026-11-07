import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, StyleSheet } from "react-native";

jest.mock("expo-image", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Image: (props: object) => React.createElement(View, props),
  };
});
jest.mock("nativewind", () => ({
  cssInterop: (component: unknown) => component,
}));

let changeMotion: (value: boolean) => void;

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

test("optional Expo image forwards caching, recycling, placeholder and accessibility controls", async () => {
  const onLoad = jest.fn();
  await render(
    <ExpoImage
      accessibilityLabel="Miniatura"
      cachePolicy="memory-disk"
      className="rounded-lg"
      contentFit="contain"
      onLoad={onLoad}
      placeholder={{ blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" }}
      recyclingKey="record-1"
      source={{ uri: "https://example.com/thumb.png", cacheKey: "thumb-v1" }}
      style={{ width: 80, height: 80 }}
      testID="optimized"
    />,
  );
  const image = screen.getByTestId("optimized");
  expect(image.props).toMatchObject({
    recyclingKey: "record-1",
    cachePolicy: "memory-disk",
    contentFit: "contain",
    accessibilityLabel: "Miniatura",
    source: { cacheKey: "thumb-v1" },
    placeholder: { blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" },
  });
  expect(StyleSheet.flatten(image.props.style)).toMatchObject({ width: 80, height: 80 });
  await fireEvent(image, "load", { source: { width: 80, height: 80 }, cacheType: "disk" });
  expect(onLoad).toHaveBeenCalledTimes(1);
});

test("image transition, animated playback and symbol effects respect system motion live", async () => {
  await render(
    <ExpoImage sfEffect="bounce" source="sf:star.fill" testID="animated" transition={180} />,
  );
  expect(screen.getByTestId("animated").props.transition).toBe(180);
  expect(screen.getByTestId("animated").props.autoplay).toBe(true);
  await act(() => changeMotion(true));
  expect(screen.getByTestId("animated").props).toMatchObject({
    transition: 0,
    autoplay: false,
    sfEffect: null,
  });
  await act(() => changeMotion(false));
  expect(screen.getByTestId("animated").props).toMatchObject({
    transition: 180,
    autoplay: true,
    sfEffect: "bounce",
  });
});

test("cache and animation opt-outs remain explicit", async () => {
  await render(
    <ExpoImage autoplay={false} cachePolicy="none" source={1} testID="private-image" />,
  );
  expect(screen.getByTestId("private-image").props).toMatchObject({
    cachePolicy: "none",
    autoplay: false,
    transition: 0,
  });
});

test("load errors remain observable instead of becoming silent placeholders", async () => {
  const error = { error: "Unavailable" };
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const onError = jest.fn();
  await render(<ExpoImage onError={onError} source={1} testID="failed" />);
  await fireEvent(screen.getByTestId("failed"), "error", error);
  expect(log).toHaveBeenCalledWith("[ExpoImage] Image load failed", "Unavailable");
  expect(onError).toHaveBeenCalledWith(error);
});
