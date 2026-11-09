import { expect, jest, test } from "@jest/globals";
import SwipeableRow from "@sincpro/mobile-ui/Display/Display.SwipeableRow";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { contrastRatio } from "@sincpro/mobile-ui/theme/contrast";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  return {
    __esModule: true,
    default: ({
      children,
      renderRightActions,
    }: {
      children: React.ReactNode;
      renderRightActions?: () => React.ReactNode;
    }) => mockReact.createElement(mockReact.Fragment, null, children, renderRightActions?.()),
  };
});

test("swipeable rows can render a visible alternative for essential actions", async () => {
  await render(
    <SwipeableRow visibleActions={<Text>Eliminar</Text>}>
      <Text>Registro</Text>
    </SwipeableRow>,
  );

  expect(screen.getByText("Registro")).toBeTruthy();
  expect(screen.getByText("Eliminar")).toBeTruthy();
});

test("action labels keep AA contrast on their fill in the dark theme", async () => {
  // text.inverse is near-black in the dark theme: on a slate action it read at 4.2:1.
  setActiveTheme(DEFAULT_DARK_THEME);
  try {
    await render(
      <SwipeableRow
        rightActions={[
          { color: "#64748B", label: "Archivar", onPress: () => {} },
          { label: "Eliminar", onPress: () => {} },
        ]}
      >
        <Text>Registro</Text>
      </SwipeableRow>,
    );
    const ink = (label: string) =>
      StyleSheet.flatten(screen.getByText(label).props.style).color as string;
    expect(contrastRatio(ink("Archivar"), "#64748B")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink("Eliminar"), DEFAULT_DARK_THEME.danger)).toBeGreaterThanOrEqual(
      4.5,
    );
  } finally {
    setActiveTheme(DEFAULT_THEME);
  }
});
