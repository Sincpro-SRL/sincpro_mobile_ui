import { expect, jest, test } from "@jest/globals";
import Splash from "@sincpro/mobile-ui/Feedback/Feedback.Splash";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

jest.mock("expo-linear-gradient", () => ({ LinearGradient: () => null }));

test("the hero splash fills its parent instead of collapsing to zero height", async () => {
  await render(
    <Splash isReady={false} title="Tickets" variant="hero">
      <Text>App</Text>
    </Splash>,
  );
  expect(StyleSheet.flatten(screen.getByTestId("hero-splash").props.style)).toMatchObject({
    flex: 1,
  });
  expect(screen.getByText("Tickets")).toBeTruthy();
});
