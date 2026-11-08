import { expect, jest, test } from "@jest/globals";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => {
  const { Text: MockText } = jest.requireActual<typeof import("react-native")>("react-native");
  return ({ color }: { color: string }) => <MockText testID="icon">{color}</MockText>;
});

function ThemeInk() {
  const theme = useTheme();
  return (
    <Text testID="ink">
      {JSON.stringify({
        ghost: theme.text.accent,
        primary: theme.text.onPrimary,
        secondary: theme.text.accent,
        tertiary: theme.text.onAccent,
      })}
    </Text>
  );
}

test.each(["ghost", "primary", "secondary", "tertiary"] as const)(
  "%s icon action draws its icon with the ink of its fill",
  async (variant) => {
    await render(
      <>
        <ThemeInk />
        <IconButton accessibilityLabel="Compartir" icon="share" onPress={jest.fn()} variant={variant} />
      </>,
    );
    const ink = JSON.parse(String(screen.getByTestId("ink").props.children));
    expect(screen.getByTestId("icon").props.children).toBe(ink[variant]);
  },
);

test("an explicit icon color still wins over the variant", async () => {
  await render(
    <IconButton
      accessibilityLabel="Volver"
      icon="back"
      iconColor="#123456"
      onPress={jest.fn()}
      variant="primary"
    />,
  );
  expect(screen.getByTestId("icon").props.children).toBe("#123456");
});
