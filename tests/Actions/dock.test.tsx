import { expect, test } from "@jest/globals";
import Dock from "@sincpro/mobile-ui/Actions/Actions.Dock";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

const createGestureEvent = (
  x: number,
  y: number,
  timestamp: number,
  previousX = 0,
  previousY = 0,
) => ({
  nativeEvent: {},
  touchHistory: {
    indexOfSingleActiveTouch: 0,
    mostRecentTimeStamp: timestamp,
    numberActiveTouches: 1,
    touchBank: [
      {
        currentPageX: x,
        currentPageY: y,
        currentTimeStamp: timestamp,
        previousPageX: previousX,
        previousPageY: previousY,
        touchActive: true,
      },
    ],
  },
});

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
  const handle = screen.getByTestId("checkout-dock-handle");
  await act(async () => {
    screen
      .getByTestId("checkout-dock-scroll", { includeHiddenElements: true })
      .props.onContentSizeChange(320, 120);
  });
  const swipeUpEvent = createGestureEvent(0, -12, 10);
  expect(handle.props.onMoveShouldSetResponderCapture(swipeUpEvent)).toBe(true);
  expect(handle.props.onResponderTerminationRequest({})).toBe(false);
  expect(typeof handle.props.onResponderMove).toBe("function");
  handle.props.onResponderMove(createGestureEvent(0, -50, 20, 0, -12));
  await act(async () => {
    handle.props.onResponderRelease(swipeUpEvent);
  });
  expect(
    screen.getByTestId("checkout-dock-expanded-content", { includeHiddenElements: true })
      .props.style.height,
  ).toBe(152);
  expect(screen.getByText("Opciones adicionales")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState
      .expanded,
  ).toBe(true);

  const swipeDownEvent = createGestureEvent(0, 50, 20);
  expect(handle.props.onMoveShouldSetResponderCapture(swipeDownEvent)).toBe(true);
  await act(async () => {
    handle.props.onResponderRelease(swipeDownEvent);
  });
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByRole("button", { name: "Ocultar opciones" })).toBeTruthy();
  expect(handle.props.onMoveShouldSetResponderCapture(createGestureEvent(20, 12, 30))).toBe(
    false,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.getByRole("button", { name: "Más opciones" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
});
