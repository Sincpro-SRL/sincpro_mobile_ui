import type { SegmentedControlProps } from "@expo/ui/community/segmented-control";
import { expect, jest, test } from "@jest/globals";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { BottomNav } from "@sincpro/mobile-ui/Navigation/Navigation.BottomNav";
import SegmentedControl from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.GradientSurface", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.Pattern", () => ({ Pattern: () => null }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@expo/ui/community/segmented-control", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: (props: SegmentedControlProps) => mockReact.createElement(View, props),
  };
});

test("AppBar exposes its title as a header and a default 48 point back action", async () => {
  await render(<AppBar onBack={jest.fn()} title="Pedidos" />);

  expect(screen.getByRole("header", { name: "Pedidos" })).toBeTruthy();
  expect(screen.getByText("Pedidos").props.numberOfLines).toBeUndefined();
  expect(screen.getByRole("button", { name: "Volver" }).props.style).toMatchObject({
    width: 48,
    height: 48,
  });
});

test("BottomNav exposes a tab list and selected tab with a default 48 point target", async () => {
  await render(
    <BottomNav
      items={[
        { key: "home", label: "Inicio", icon: "home" },
        { key: "orders", label: "Pedidos", icon: "list" },
      ]}
      onChange={jest.fn()}
      testID="bottom-tabs"
      value="orders"
    />,
  );

  expect(screen.getByTestId("bottom-tabs").props.accessibilityRole).toBe("tablist");
  expect(screen.getByRole("tab", { name: "Pedidos" }).props.accessibilityState).toMatchObject(
    {
      selected: true,
    },
  );
  expect(screen.getByRole("tab", { name: "Pedidos" }).props.style).toMatchObject({
    minHeight: 48,
    minWidth: 48,
  });
  expect(screen.getByText("Pedidos").props.numberOfLines).toBeUndefined();
});

test("native segmented options preserve selected values and meet the 48 point target", async () => {
  const onChange = jest.fn<(value: string) => void>();
  await render(
    <SegmentedControl
      onChange={onChange}
      options={[
        { label: "Abiertos", value: "open" },
        { label: "Cerrados", value: "closed" },
      ]}
      testID="views"
      value="open"
    />,
  );

  const native = screen.getByTestId("views-segments-0");
  expect(native.props.values).toEqual(["Abiertos", "Cerrados"]);
  expect(native.props.selectedIndex).toBe(0);
  expect(StyleSheet.flatten(native.props.style)).toMatchObject({ minHeight: 48 });
  await fireEvent(native, "change", {
    nativeEvent: { selectedSegmentIndex: 1, value: "Cerrados" },
  });
  expect(onChange).toHaveBeenCalledWith("closed");
});

test("native segmented labels remain complete and container styles stay locally customizable", async () => {
  await render(
    <SegmentedControl
      accessibilityLabel="Vista del inventario"
      onChange={jest.fn<(value: string) => void>()}
      options={[{ label: "Registros pendientes de sincronización", value: "pending" }]}
      style={{ paddingVertical: 12 }}
      testID="inventory-view"
      value="pending"
    />,
  );
  const label = screen.getByText("Vista del inventario");
  expect(label.props.numberOfLines).toBeUndefined();
  expect(label.props.allowFontScaling).not.toBe(false);
  expect(StyleSheet.flatten(screen.getByTestId("inventory-view").props.style)).toMatchObject({
    paddingVertical: 12,
  });
  const native = screen.getByTestId("inventory-view-segments-0");
  expect(native.props.values).toEqual(["Registros pendientes de sincronización"]);
  expect(native.props.accessibilityLabel).toBe("Vista del inventario");
  expect(StyleSheet.flatten(native.props.style).minHeight).toBe(48);
});

test("labeled AppBar actions grow with scaled multiline text instead of a fixed height", async () => {
  const label = "Guardar todos los cambios del pedido";
  await render(<AppBar.Action icon="save" label={label} onPress={jest.fn()} tone="tinted" />);
  const action = screen.getByRole("button", { name: label });
  expect(action.props.style).toMatchObject({ minWidth: 48, minHeight: 48 });
  expect(action.props.style.height).toBeUndefined();
  const text = screen.getByText(label);
  expect(text.props.allowFontScaling).not.toBe(false);
  expect(text.props.numberOfLines).toBeUndefined();
  expect(StyleSheet.flatten(text.props.style).flexShrink).toBe(1);
});

test.each(["none", "pill", "pill-text", "bar", "glow"] as const)(
  "BottomNav %s tabs, including icon-only tabs, retain 48 point targets",
  async (indicator) => {
    await render(
      <BottomNav
        indicator={indicator}
        items={[
          { key: "home", label: "Información del inicio", icon: "home" },
          { key: "orders", icon: "list" },
        ]}
        onChange={jest.fn()}
        showLabels={false}
        value="home"
      />,
    );
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.props.style).toMatchObject({ minHeight: 48, minWidth: 48 });
    }
  },
);

test("disabled segmented options expose state and cannot dispatch changes", async () => {
  const onChange = jest.fn<(value: string) => void>();
  const options = [
    { label: "Lista", value: "list" },
    { label: "Mapa", value: "map", disabled: true },
  ];
  const { rerender } = await render(
    <SegmentedControl onChange={onChange} options={options} testID="views" value="list" />,
  );
  const map = screen.getByTestId("views-segments-1");
  expect(map.props.enabled).toBe(false);
  expect(map.props.selectedIndex).toBe(-1);
  await fireEvent(map, "change", { nativeEvent: { selectedSegmentIndex: 0, value: "Mapa" } });
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent(screen.getByTestId("views-segments-0"), "change", {
    nativeEvent: { selectedSegmentIndex: 0, value: "Lista" },
  });
  expect(onChange).toHaveBeenCalledWith("list");
  await rerender(
    <SegmentedControl
      disabled
      onChange={onChange}
      options={options}
      testID="views"
      value="list"
    />,
  );
  expect(screen.getByTestId("views-segments-0").props.enabled).toBe(false);
  await fireEvent(screen.getByTestId("views-segments-0"), "change", {
    nativeEvent: { selectedSegmentIndex: 0, value: "Lista" },
  });
  expect(onChange).toHaveBeenCalledTimes(1);
});
