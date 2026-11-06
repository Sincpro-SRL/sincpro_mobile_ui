import { expect, jest, test } from "@jest/globals";
import SwipeableRow from "@sincpro/mobile-ui/Display/Display.SwipeableRow";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) =>
      mockReact.createElement(mockReact.Fragment, null, children),
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
