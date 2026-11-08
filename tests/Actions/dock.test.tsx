import { expect, jest, test } from "@jest/globals";
import Dock from "@sincpro/mobile-ui/Actions/Actions.Dock";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { type ReactNode, useState } from "react";
import { StyleSheet, Text, type ViewStyle } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }),
}));
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    KeyboardStickyView: (props: { children?: ReactNode }) =>
      mockReact.createElement(View, props),
  };
});
jest.mock("@expo/ui/community/bottom-sheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: ({
      children,
      index,
      ...rest
    }: {
      children: ReactNode;
      index: number;
      onClose: () => void;
      enablePanDownToClose: boolean;
      snapPoints: (string | number)[];
    }) => {
      const style: ViewStyle | undefined = index < 0 ? { display: "none" } : undefined;
      const props = {
        ...rest,
        index,
        testID: "native-sheet",
        style,
      };
      return mockReact.createElement(View, props, index >= 0 ? children : null);
    },
    BottomSheetView: View,
  };
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
  expect(screen.getByTestId("checkout-dock").props.enabled).toBe(true);
  expect(screen.getByTestId("checkout-dock").props.offset).toEqual({ opened: 16 });
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByText("Opciones adicionales")).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "Confirmar" })).toHaveLength(1);
  expect(screen.getByTestId("checkout-dock").props.enabled).toBe(false);
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState
      .expanded,
  ).toBe(true);

  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(screen.queryByText("Opciones adicionales")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByRole("button", { name: "Ocultar opciones" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.getByRole("button", { name: "Más opciones" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  expect(screen.getByTestId("checkout-dock").props.enabled).toBe(true);
});

test("native sheet isolates the overlay and dismisses without duplicating the primary action", async () => {
  const onConfirm = jest.fn<() => void>();
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
  expect(screen.getByTestId("dock-sheet").props.accessibilityViewIsModal).toBe(true);
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(true);
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(screen.queryByText("Acción del panel")).toBeNull();
  expect(screen.getByText("Guardar")).toBeTruthy();
});

test("controlled expansion honors host state and the native dismissal policy", async () => {
  const onChange = jest.fn<(expanded: boolean) => void>();
  const props = {
    expanded: true,
    onExpandedChange: onChange,
    primaryAction: <Text>Guardar</Text>,
    testID: "dock",
  };
  const { rerender } = await render(
    <Dock {...props} dismissible={false}>
      <Text>Detalle</Text>
    </Dock>,
  );
  expect(screen.getByTestId("native-sheet").props.enablePanDownToClose).toBe(false);
  expect(
    screen.getByRole("button", { name: "Ocultar opciones" }).props.accessibilityState
      .disabled,
  ).toBe(true);
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(onChange).not.toHaveBeenCalled();
  await rerender(
    <Dock {...props} dismissible>
      <Text>Detalle</Text>
    </Dock>,
  );
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(onChange).toHaveBeenCalledWith(false);
  expect(screen.getByText("Detalle")).toBeTruthy();
});

test("host-controlled state closes the overlay and keeps draft data outside remounted slots", async () => {
  function Example() {
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState(0);
    return (
      <Dock
        expanded={expanded}
        onExpandedChange={setExpanded}
        primaryAction={<Text>Guardar</Text>}
      >
        <Text>Detalle</Text>
        <Text>{`Borrador: ${draft}`}</Text>
        <Pressable
          accessibilityLabel="Incrementar"
          accessibilityRole="button"
          onPress={() => setDraft((current) => current + 1)}
        >
          <Text>Incrementar</Text>
        </Pressable>
      </Dock>
    );
  }
  await render(<Example />);
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByText("Detalle")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Incrementar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Ocultar opciones" }));
  expect(screen.queryByText("Detalle")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Más opciones" }));
  expect(screen.getByText("Borrador: 1")).toBeTruthy();
});

test("native presentation updates leave the overlay open until dismissal completes", async () => {
  const onChange = jest.fn<(expanded: boolean) => void>();
  const props = {
    defaultExpanded: true,
    onExpandedChange: onChange,
    primaryAction: <Text>Guardar</Text>,
    testID: "dock",
  };
  const { rerender } = await render(
    <Dock {...props}>
      <Text>Detalle</Text>
    </Dock>,
  );
  await rerender(
    <Dock {...props} snapPoints={["70%", "90%"]}>
      <Text>Detalle</Text>
    </Dock>,
  );
  expect(screen.getByTestId("native-sheet").props.index).toBe(0);
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["70%", "90%"]);
  expect(screen.queryByTestId("dock-handle")).toBeNull();
  expect(screen.getByText("Detalle")).toBeTruthy();
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Detalle")).toBeNull();
});

test("native layout owns sheet height and keyboard while collapsed docks own their safe area", async () => {
  await render(
    <Dock
      defaultExpanded
      primaryAction={<Text>Guardar</Text>}
      snapPoints={["90%", 480]}
      testID="dock"
    >
      <Text>Detalle</Text>
    </Dock>,
  );
  expect(screen.getByTestId("native-sheet").props.snapPoints).toEqual(["90%", 480]);
  const scroll = screen
    .getByTestId("dock-sheet")
    .queryAll((node) => node.props.keyboardShouldPersistTaps === "handled")[0];
  expect(scroll.props.keyboardDismissMode).toBe("on-drag");
  expect(StyleSheet.flatten(screen.getByTestId("dock-bar").props.style).paddingBottom).toBe(
    8,
  );
  await fireEvent(screen.getByTestId("native-sheet"), "close");
  expect(StyleSheet.flatten(screen.getByTestId("dock-bar").props.style).paddingBottom).toBe(
    24,
  );
  expect(screen.getByTestId("dock").props.enabled).toBe(true);
});
