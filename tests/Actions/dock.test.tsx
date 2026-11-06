import { expect, jest, test } from "@jest/globals";
import Dock from "@sincpro/mobile-ui/Actions/Actions.Dock";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { useState } from "react";
import { Dimensions, Text } from "react-native";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }),
}));

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
  const handle = screen.getByTestId("checkout-dock-handle", { includeHiddenElements: true });
  expect(handle.props.onStartShouldSetResponder({})).toBe(true);
  const swipeUpEvent = createGestureEvent(0, -12, 10);
  handle.props.onMoveShouldSetResponderCapture(swipeUpEvent);
  expect(handle.props.onResponderTerminationRequest({})).toBe(false);
  expect(typeof handle.props.onResponderMove).toBe("function");
  handle.props.onResponderMove(createGestureEvent(0, -50, 20, 0, -12));
  await act(async () => {
    handle.props.onResponderRelease(swipeUpEvent);
  });
  expect(screen.getByText("Opciones adicionales")).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "Confirmar" })).toHaveLength(1);
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState
      .expanded,
  ).toBe(true);

  const modalHandle = screen.getByTestId("checkout-dock-handle", {
    includeHiddenElements: true,
  });
  const swipeDownEvent = createGestureEvent(0, 50, 30);
  modalHandle.props.onMoveShouldSetResponderCapture(swipeDownEvent);
  await act(async () => {
    modalHandle.props.onResponderRelease(swipeDownEvent);
  });
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByRole("button", { name: "Ocultar opciones" })).toBeTruthy();
  const diagonal = createGestureEvent(100, 50, 40);
  const newHandle = screen.getByTestId("checkout-dock-handle", {
    includeHiddenElements: true,
  });
  newHandle.props.onMoveShouldSetResponderCapture(diagonal);
  await act(async () => newHandle.props.onResponderRelease(diagonal));
  expect(screen.getByRole("button", { name: "Ocultar opciones" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.getByRole("button", { name: "Más opciones" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
});

test("modal backdrop blocks the screen and dismisses without duplicating the primary action", async () => {
  const onConfirm = jest.fn();
  await render(
    <Dock
      defaultExpanded
      primaryAction={
        <Pressable onPress={onConfirm}>
          <Text>Guardar</Text>
        </Pressable>
      }
      testID="dock"
    >
      <Pressable onPress={onConfirm}>
        <Text>Acción del panel</Text>
      </Pressable>
    </Dock>,
  );
  await fireEvent.press(screen.getByText("Acción del panel"));
  await fireEvent.press(screen.getByText("Guardar"));
  expect(onConfirm).toHaveBeenCalledTimes(2);
  expect(screen.getAllByText("Guardar")).toHaveLength(1);
  await fireEvent.press(screen.getByTestId("dock-backdrop"));
  expect(screen.queryByText("Acción del panel")).toBeNull();
  expect(screen.getByText("Guardar")).toBeTruthy();
});

test("controlled expansion honors the host and backdrop policy; native Back always requests close", async () => {
  const onChange = jest.fn();
  await render(
    <Dock
      expanded
      dismissOnBackdrop={false}
      onExpandedChange={onChange}
      primaryAction={<Text>Guardar</Text>}
      testID="dock"
    >
      <Text>Detalle</Text>
    </Dock>,
  );
  await fireEvent.press(screen.getByTestId("dock-backdrop"));
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("dock-modal"), "requestClose");
  expect(onChange).toHaveBeenCalledWith(false);
  expect(screen.getByText("Detalle")).toBeTruthy();
});

test("host-controlled state closes the overlay and keeps draft data outside remounted slots", async () => {
  function Example() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Dock
        expanded={expanded}
        onExpandedChange={setExpanded}
        primaryAction={<Text>Guardar</Text>}
      >
        <Text>Detalle</Text>
      </Dock>
    );
  }
  await render(<Example />);
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByText("Detalle")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.queryByText("Detalle")).toBeNull();
});

test("short and interrupted drags leave the overlay open", async () => {
  const onChange = jest.fn();
  await render(
    <Dock defaultExpanded onExpandedChange={onChange} primaryAction={<Text>Guardar</Text>} testID="dock">
      <Text>Detalle</Text>
    </Dock>,
  );
  const handle = screen.getByTestId("dock-handle");
  const shortDrag = createGestureEvent(0, 10, 100);
  handle.props.onMoveShouldSetResponderCapture(shortDrag);
  await act(async () => handle.props.onResponderRelease(shortDrag));
  expect(onChange).not.toHaveBeenCalled();
  await act(async () => handle.props.onResponderTerminate({}));
  expect(screen.getByText("Detalle")).toBeTruthy();
  expect(onChange).not.toHaveBeenCalled();
});

test("panel height reserves footer and safe area space instead of using a fixed content height", async () => {
  await render(
    <Dock defaultExpanded maxExpandedHeightRatio={0.9} primaryAction={<Text>Guardar</Text>} testID="dock">
      <Text>Detalle</Text>
    </Dock>,
  );
  await fireEvent(screen.getByTestId("dock-bar"), "layout", {
    nativeEvent: { layout: { width: 390, height: 100, x: 0, y: 0 } },
  });
  const panel = screen.getByTestId("dock-expanded-content").props.style;
  expect(panel.height).toBeUndefined();
  const height = Dimensions.get("window").height;
  expect(panel.maxHeight).toBe(Math.max(0, Math.min(height * 0.9, height - 24 - 16 - 100)));
  expect(screen.getByTestId("dock-scroll").props.keyboardShouldPersistTaps).toBe("handled");
});
