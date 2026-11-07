import { afterEach, expect, jest, test } from "@jest/globals";
import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, StyleSheet, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return (props: object) => React.createElement(View, { ...props, testID: "fallback-icon" });
});
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Skeleton", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return () => React.createElement(View, { testID: "image-loading" });
});

afterEach(async () => {
  await act(() => setActiveTheme(DEFAULT_THEME));
  jest.restoreAllMocks();
});

const source = { uri: "https://example.com/first.png" };
const errorEvent = { nativeEvent: { error: "Image not found" } };

test("image forwards native callbacks, accessibility and styles while keeping its placeholder", async () => {
  const loaded = jest.fn();
  const started = jest.fn();
  const ended = jest.fn();
  await render(
    <DisplayImage
      accessibilityLabel="Foto del producto"
      accessible
      containerStyle={{ marginTop: 8 }}
      height={80}
      onLoad={loaded}
      onLoadEnd={ended}
      onLoadStart={started}
      source={source}
      style={{ opacity: 0.9 }}
      testID="photo"
    />,
  );
  const image = screen.getByLabelText("Foto del producto");
  expect(screen.getByTestId("image-loading")).toBeTruthy();
  expect(StyleSheet.flatten(screen.getByTestId("photo").props.style)).toMatchObject({
    height: 80,
    marginTop: 8,
  });
  expect(StyleSheet.flatten(image.props.style).opacity).toBe(0.9);
  await fireEvent(image, "loadStart");
  await fireEvent(image, "load", { nativeEvent: { source: { width: 80, height: 80 } } });
  await fireEvent(image, "loadEnd");
  expect(started).toHaveBeenCalledTimes(1);
  expect(loaded).toHaveBeenCalledTimes(1);
  expect(ended).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId("image-loading")).toBeNull();
});

test("source changes reset a successful load and an equivalent inline source does not", async () => {
  const { rerender } = await render(
    <DisplayImage accessibilityLabel="Foto" source={source} />,
  );
  await fireEvent(screen.getByLabelText("Foto"), "loadEnd");
  expect(screen.queryByTestId("image-loading")).toBeNull();
  await rerender(<DisplayImage accessibilityLabel="Foto" source={{ ...source }} />);
  expect(screen.queryByTestId("image-loading")).toBeNull();
  await rerender(
    <DisplayImage
      accessibilityLabel="Foto"
      source={{ uri: "https://example.com/second.png" }}
    />,
  );
  expect(screen.getByTestId("image-loading")).toBeTruthy();
});

test("image errors log, notify the host and recover when the source changes", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const onError = jest.fn();
  const { rerender } = await render(
    <DisplayImage accessibilityLabel="Foto" onError={onError} source={source} />,
  );
  await fireEvent(screen.getByLabelText("Foto"), "error", errorEvent);
  expect(log).toHaveBeenCalledWith("[Display.Image] Image load failed", "Image not found");
  expect(onError).toHaveBeenCalledWith(errorEvent);
  expect(screen.queryByTestId("image-loading")).toBeNull();
  expect(screen.getByLabelText("Foto. Imagen no disponible")).toBeTruthy();
  await rerender(
    <DisplayImage
      accessibilityLabel="Foto"
      source={{ uri: "https://example.com/recovered.png" }}
    />,
  );
  expect(screen.getByLabelText("Foto")).toBeTruthy();
  expect(screen.queryByTestId("fallback-icon")).toBeNull();
  expect(screen.getByTestId("image-loading")).toBeTruthy();
});

test("custom error composition can retry the same source without remounting the host", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await render(
    <DisplayImage
      accessibilityLabel="Foto"
      renderError={(retry) => (
        <Pressable accessibilityRole="button" onPress={retry}>
          <Text>Reintentar imagen</Text>
        </Pressable>
      )}
      source={source}
    />,
  );
  await fireEvent(screen.getByLabelText("Foto"), "error", errorEvent);
  await fireEvent.press(screen.getByRole("button", { name: "Reintentar imagen" }));
  expect(screen.getByLabelText("Foto")).toBeTruthy();
  expect(screen.getByTestId("image-loading")).toBeTruthy();
  await fireEvent(screen.getByLabelText("Foto"), "loadEnd");
  expect(screen.queryByTestId("image-loading")).toBeNull();
});

test("a late event from the previous source cannot settle the replacement", async () => {
  const { rerender } = await render(
    <DisplayImage accessibilityLabel="Foto" source={source} />,
  );
  const oldOnLoadEnd = screen.getByLabelText("Foto").props.onLoadEnd;
  await rerender(
    <DisplayImage
      accessibilityLabel="Foto"
      source={{ uri: "https://example.com/new.png" }}
    />,
  );
  await act(() => oldOnLoadEnd());
  expect(screen.getByTestId("image-loading")).toBeTruthy();
});

test("fallback colors react to theme changes", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await render(<DisplayImage accessibilityLabel="Foto" source={source} />);
  await fireEvent(screen.getByLabelText("Foto"), "error", errorEvent);
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(screen.getByTestId("fallback-icon").props.color).toBe(
    DEFAULT_DARK_THEME.icon.disabled,
  );
});
