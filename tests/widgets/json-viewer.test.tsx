import { expect, test } from "@jest/globals";
import { ThemedActivityIndicator, useTheme } from "@sincpro/mobile-ui/theme";
import JsonPreview from "@sincpro/mobile-ui/widgets/JSONViewer";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

function Ink() {
  const theme = useTheme();
  return <Text testID="ink">{JSON.stringify(theme)}</Text>;
}

test("JSON fragments take their colors from the theme, so the viewer reads in dark mode", async () => {
  await render(
    <>
      <Ink />
      <JsonPreview selectedJson={'{"total": 12, "estado": "pagado", "nota": null}'} />
    </>,
  );
  const theme = JSON.parse(String(screen.getByTestId("ink").props.children));
  expect(screen.getByText('"total"').props.style).toMatchObject({ color: theme.info });
  expect(screen.getByText(/"pagado"/).props.style).toMatchObject({ color: theme.success });
  expect(screen.getByText(/^12/).props.style).toMatchObject({ color: theme.warning });
  expect(screen.getByText(/^null/).props.style).toMatchObject({ color: theme.text.tertiary });
});

test("the themed spinner defaults to the theme primary", async () => {
  await render(
    <>
      <Ink />
      <ThemedActivityIndicator testID="spinner" />
    </>,
  );
  const theme = JSON.parse(String(screen.getByTestId("ink").props.children));
  expect(screen.getByTestId("spinner").props.color).toBe(theme.primary);
});
