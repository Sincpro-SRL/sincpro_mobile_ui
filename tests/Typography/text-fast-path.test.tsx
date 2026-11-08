import { expect, test } from "@jest/globals";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { act, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

test("without className the text skips class merging and follows the live theme color", async () => {
  await render(
    <Typography.Text align="center" testID="plain" transform="uppercase" underline>
      Total
    </Typography.Text>,
  );
  const text = screen.getByTestId("plain");
  expect(text.props.className).toBeUndefined();
  expect(StyleSheet.flatten(text.props.style)).toMatchObject({
    color: DEFAULT_THEME.text.primary,
    textAlign: "center",
    textTransform: "uppercase",
    textDecorationLine: "underline",
  });
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(StyleSheet.flatten(screen.getByTestId("plain").props.style).color).toBe(
    DEFAULT_DARK_THEME.text.primary,
  );
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("a consumer style still wins over the theme color", async () => {
  await render(
    <Typography.Text style={{ color: "#123456" }} testID="styled">
      Total
    </Typography.Text>,
  );
  expect(StyleSheet.flatten(screen.getByTestId("styled").props.style).color).toBe("#123456");
});

test("with className the class contract is unchanged", async () => {
  await render(
    <Typography.Text align="right" className="text-danger" testID="classed">
      Error
    </Typography.Text>,
  );
  const text = screen.getByTestId("classed");
  expect(String(text.props.className)).toContain("text-danger");
  expect(String(text.props.className)).toContain("text-right");
  expect(String(text.props.className)).not.toContain("text-text-primary");
});
