import { expect, jest, test } from "@jest/globals";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { BottomNav } from "@sincpro/mobile-ui/Navigation/Navigation.BottomNav";
import SegmentedControl from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import { render, screen } from "@testing-library/react-native";

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
