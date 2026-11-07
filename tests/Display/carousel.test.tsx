import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Carousel from "@sincpro/mobile-ui/Display/Display.Carousel";
import { DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text } from "react-native";

const mockScrollTo = jest.fn();
let changeMotion: (enabled: boolean) => void;
const items = ["Uno", "Dos", "Tres"];
const itemProps = {
  data: items,
  itemWidth: 100,
  keyExtractor: (item: string) => item,
  renderItem: (item: string) => <Text>{item}</Text>,
  testID: "carousel",
};

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
beforeEach(() => {
  mockScrollTo.mockClear();
  jest.spyOn(ScrollView.prototype, "scrollTo").mockImplementation(mockScrollTo);
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation((_event, listener) => {
    changeMotion = listener;
    return { remove: jest.fn() };
  });
});
afterEach(async () => {
  await act(() => setActiveTheme(DEFAULT_THEME));
  jest.restoreAllMocks();
});

test("named 48-point controls navigate without swiping and stop at each boundary", async () => {
  const onIndexChange = jest.fn();
  await render(<Carousel {...itemProps} onIndexChange={onIndexChange} />);
  const previous = screen.getByRole("button", { name: "Elemento anterior" });
  expect(previous.props.accessibilityState.disabled).toBe(true);
  expect(StyleSheet.flatten(previous.props.style)).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 112, y: 0, animated: true });
  expect(screen.getByText("Elemento 2 de 3")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  expect(
    screen.getByRole("button", { name: "Elemento siguiente" }).props.accessibilityState
      .disabled,
  ).toBe(true);
  expect(onIndexChange.mock.calls).toEqual([[1], [2]]);
});

test("programmatic navigation respects live reduced motion", async () => {
  await render(<Carousel {...itemProps} />);
  await act(() => changeMotion(true));
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 112, y: 0, animated: false });
  await act(() => changeMotion(false));
  await fireEvent.press(screen.getByRole("button", { name: "Elemento anterior" }));
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 0, y: 0, animated: true });
});

test("overscroll is clamped and removed items cannot leave or resurrect an invalid selection", async () => {
  const onIndexChange = jest.fn();
  const { rerender } = await render(
    <Carousel {...itemProps} onIndexChange={onIndexChange} />,
  );
  await fireEvent(screen.getByTestId("carousel-scroll"), "momentumScrollEnd", {
    nativeEvent: { contentOffset: { x: -1000 } },
  });
  expect(onIndexChange).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("carousel-scroll"), "momentumScrollEnd", {
    nativeEvent: { contentOffset: { x: 10000 } },
  });
  expect(screen.getByText("Elemento 3 de 3")).toBeTruthy();
  await rerender(
    <Carousel {...itemProps} data={items.slice(0, 1)} onIndexChange={onIndexChange} />,
  );
  expect(screen.queryByRole("button", { name: "Elemento siguiente" })).toBeNull();
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 0, y: 0, animated: false });
  await rerender(<Carousel {...itemProps} onIndexChange={onIndexChange} />);
  expect(screen.getByText("Elemento 1 de 3")).toBeTruthy();
  expect(onIndexChange.mock.calls).toEqual([[2], [0]]);
});

test("controlled state moves only when the host accepts the requested index", async () => {
  const onIndexChange = jest.fn();
  const { rerender } = await render(
    <Carousel {...itemProps} index={0} onIndexChange={onIndexChange} />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(mockScrollTo).not.toHaveBeenCalled();
  expect(screen.getByText("Elemento 1 de 3")).toBeTruthy();
  await rerender(<Carousel {...itemProps} index={1} onIndexChange={onIndexChange} />);
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 112, y: 0, animated: true });
  expect(screen.getByText("Elemento 2 de 3")).toBeTruthy();
});

test("custom controls and item/native styles preserve navigation logic", async () => {
  await render(
    <Carousel
      {...itemProps}
      contentContainerStyle={{ paddingVertical: 10 }}
      itemStyle={{ borderRadius: 22 }}
      renderControls={(controls) => (
        <Pressable accessibilityRole="button" onPress={() => controls.goTo(2)}>
          <Text>{`Personalizado ${controls.index + 1}/${controls.count}`}</Text>
        </Pressable>
      )}
      style={{ marginTop: 17 }}
    />,
  );
  expect(StyleSheet.flatten(screen.getByTestId("carousel").props.style).marginTop).toBe(17);
  expect(screen.getByTestId("carousel-scroll").props.contentContainerStyle).toEqual({
    paddingVertical: 10,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Personalizado 1/3" }));
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 224, y: 0, animated: true });
  expect(screen.getByText("Personalizado 3/3")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Elemento siguiente" })).toBeNull();
});

test("repeated native swipes rejected by a controlled host restore its accepted position", async () => {
  const onIndexChange = jest.fn();
  await render(<Carousel {...itemProps} index={0} onIndexChange={onIndexChange} />);
  for (let attempt = 0; attempt < 2; attempt++) {
    await fireEvent(screen.getByTestId("carousel-scroll"), "momentumScrollEnd", {
      nativeEvent: { contentOffset: { x: 112 } },
    });
    expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 0, y: 0, animated: true });
    expect(screen.getByText("Elemento 1 de 3")).toBeTruthy();
  }
  expect(mockScrollTo).toHaveBeenCalledTimes(2);
  expect(onIndexChange.mock.calls).toEqual([[1], [1]]);
});

test("measured trailing space lets the last narrow card reach its snap position", async () => {
  await render(<Carousel {...itemProps} />);
  await fireEvent(screen.getByTestId("carousel-scroll"), "layout", {
    nativeEvent: { layout: { width: 300 } },
  });
  expect(
    StyleSheet.flatten(
      screen.getByTestId("carousel-end-spacing", { includeHiddenElements: true }).props.style,
    ).width,
  ).toBe(200);
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 0, y: 0, animated: false });
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elemento siguiente" }));
  expect(mockScrollTo).toHaveBeenLastCalledWith({ x: 224, y: 0, animated: true });
});

test.each([
  { itemWidth: 0 },
  { itemWidth: Infinity },
  { gap: -1 },
  { gap: NaN },
  { data: ["duplicado", "duplicado"] },
])("invalid carousel geometry/keys are rejected explicitly: %j", async (props) => {
  await expect(render(<Carousel {...itemProps} {...props} />)).rejects.toThrow();
});

test("empty data has no invented pagination or navigation actions", async () => {
  await render(<Carousel {...itemProps} data={[]} />);
  expect(screen.queryByRole("button")).toBeNull();
  expect(mockScrollTo).not.toHaveBeenCalled();
});
