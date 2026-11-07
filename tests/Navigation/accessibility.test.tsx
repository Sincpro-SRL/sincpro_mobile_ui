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

test("AppBar exposes its title as a header and supports an opt-in 48 point back action", async () => {
  await render(<AppBar accessibleSizing onBack={jest.fn()} title="Pedidos" />);

  expect(screen.getByRole("header", { name: "Pedidos" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Volver" }).props.style).toMatchObject({
    width: 48,
    height: 48,
  });
});

test("BottomNav exposes a tab list and selected tab with accessible sizing", async () => {
  await render(
    <BottomNav
      accessibleSizing
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
  });
});

test("segmented options keep tab semantics and optionally meet the 48 point target", async () => {
  await render(
    <SegmentedControl
      accessibleSizing
      onChange={jest.fn()}
      options={[
        { label: "Abiertos", value: "open" },
        { label: "Cerrados", value: "closed" },
      ]}
      value="open"
    />,
  );

  expect(screen.getByRole("tab", { name: "Abiertos" }).props.accessibilityState).toEqual({
    selected: true,
  });
  expect(screen.getByRole("tab", { name: "Abiertos" }).props.style).toMatchObject({
    minHeight: 48,
  });
});

test("mobile segmented labels wrap and styles stay locally customizable", async () => {
  await render(
    <SegmentedControl
      accessibilityLabel="Vista del inventario"
      accessibleSizing
      labelTextProps={{ style: { fontSize: 18, fontWeight: "700" } }}
      onChange={jest.fn()}
      options={[{ label: "Registros pendientes de sincronización", value: "pending" }]}
      optionStyle={{ paddingVertical: 12 }}
      value="pending"
    />,
  );
  const label = screen.getByText("Registros pendientes de sincronización");
  expect(label.props.numberOfLines).toBeUndefined();
  expect(StyleSheet.flatten(label.props.style)).toMatchObject({
    fontSize: 18,
    fontWeight: "700",
  });
  const tab = screen.getByRole("tab");
  expect(StyleSheet.flatten(tab.props.style)).toMatchObject({
    minHeight: 48,
    paddingVertical: 12,
  });
  expect(tab.props.hitSlop).toBe(0);
});

test("disabled segmented options expose state and cannot dispatch changes", async () => {
  const onChange = jest.fn();
  const options = [
    { label: "Lista", value: "list" },
    { label: "Mapa", value: "map", disabled: true, accessibilityHint: "Requiere ubicación" },
  ];
  const { rerender } = await render(
    <SegmentedControl onChange={onChange} options={options} value="list" />,
  );
  const map = screen.getByRole("tab", { name: "Mapa" });
  expect(map.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
  expect(map.props.accessibilityHint).toBe("Requiere ubicación");
  await fireEvent.press(map);
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("tab", { name: "Lista" }));
  expect(onChange).toHaveBeenCalledWith("list");
  await rerender(
    <SegmentedControl disabled onChange={onChange} options={options} value="list" />,
  );
  await fireEvent.press(screen.getByRole("tab", { name: "Lista" }));
  expect(onChange).toHaveBeenCalledTimes(1);
});
