import { expect, test } from "@jest/globals";
import Dock from "@sincpro/mobile-ui/Actions/Actions.Dock";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

test("expands details while the primary action stays fixed and supports accessible collapse", async () => {
  await render(
    <Dock
      primaryAction={
        <Pressable accessibilityRole="button">
          <Text>Confirmar</Text>
        </Pressable>
      }
      summary={<Text>Resumen</Text>}
      testID="checkout-dock"
      title="Detalle de pago"
    >
      <Text>Opciones adicionales</Text>
    </Dock>,
  );

  expect(screen.getByText("Resumen")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByText("Opciones adicionales")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState.expanded,
  ).toBe(true);

  expect(
    typeof screen.getByTestId("checkout-dock-handle").props.onMoveShouldSetResponder,
  ).toBe("function");
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.getByRole("button", { name: "Más opciones" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
});
