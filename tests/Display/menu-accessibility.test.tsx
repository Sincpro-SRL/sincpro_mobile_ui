import { expect, jest, test } from "@jest/globals";
import MenuButton from "@sincpro/mobile-ui/Display/Display.MenuButton";
import MenuCard from "@sincpro/mobile-ui/Display/Display.MenuCard";
import { QuickActions } from "@sincpro/mobile-ui/widgets/QuickActions";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("an actionable menu row is one button that reads its label, detail, value and badge", async () => {
  const onPress = jest.fn();
  await render(
    <MenuButton
      badge="new"
      description="Bluetooth"
      label="Impresora"
      onPress={onPress}
      value="Conectada"
    />,
  );
  const row = screen.getByRole("button", { name: "Impresora, Bluetooth, Conectada, Nuevo" });
  expect(row.props.accessibilityState).toMatchObject({ disabled: false, busy: false });
  await fireEvent.press(row);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("a toggle row leaves the switch reachable and named", async () => {
  const onToggle = jest.fn();
  await render(
    <MenuButton
      description="Avisos en el teléfono"
      label="Notificaciones"
      toggle={{ value: false, onToggle }}
    />,
  );
  expect(screen.queryByRole("button")).toBeNull();
  const toggle = screen.getByRole("switch", { name: "Notificaciones" });
  expect(toggle.props.accessibilityHint).toBe("Avisos en el teléfono");
  await fireEvent(toggle, "valueChange", true);
  expect(onToggle).toHaveBeenCalledWith(true);
});

test("menu tiles and quick actions are buttons named by their label", async () => {
  await render(<MenuCard icon="settings" onPress={jest.fn()} title="Ajustes" />);
  expect(screen.getByRole("button", { name: "Ajustes" })).toBeTruthy();

  await render(
    <QuickActions
      items={[
        { id: "sync", label: "Sincronizar", icon: "sync", badge: 3 },
        { id: "scan", label: "Escanear", icon: "camera" },
      ]}
    />,
  );
  expect(screen.getByRole("button", { name: "Sincronizar, 3" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Escanear" })).toBeTruthy();
});
