import { expect, jest, test } from "@jest/globals";
import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

const mockMounts = { count: 0 };
jest.mock("expo-image", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Image: (props: object) => {
      React.useEffect(() => {
        mockMounts.count += 1;
      }, []);
      return React.createElement(View, props);
    },
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Skeleton", () => () => null);

test("a new source reuses the native view (FlashList recycling); only a retry remounts it", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  const image = (uri: string) => (
    <DisplayImage
      accessibilityLabel="Producto"
      renderError={(retry) => (
        <Pressable accessibilityRole="button" onPress={retry}>
          <Text>Reintentar</Text>
        </Pressable>
      )}
      source={{ uri }}
    />
  );
  const { rerender } = await render(image("https://cdn.test/1.png"));
  expect(mockMounts.count).toBe(1);

  for (const index of [2, 3, 4]) await rerender(image(`https://cdn.test/${index}.png`));
  expect(mockMounts.count).toBe(1);
  expect(screen.getByLabelText("Producto").props.recyclingKey).toBe(
    JSON.stringify({ uri: "https://cdn.test/4.png" }),
  );

  await fireEvent(screen.getByLabelText("Producto"), "error", { error: "404" });
  await fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));
  expect(mockMounts.count).toBe(2);
});
