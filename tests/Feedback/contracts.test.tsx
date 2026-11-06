import { expect, jest, test } from "@jest/globals";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import ErrorState from "@sincpro/mobile-ui/Feedback/Feedback.Error";
import BaseButton from "@sincpro/mobile-ui/primitives/BaseButton";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("empty state offers a named accessible action without a confirmation provider", async () => {
  const create = jest.fn();
  await render(
    <EmptyState
      accessibleSizing
      actionLabel="Crear"
      description="Empieza creando un registro"
      onAction={create}
      title="No hay registros"
    />,
  );
  expect(screen.getByRole("header", { name: "No hay registros" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Crear" }).props.style.minHeight).toBe(48);
  await fireEvent.press(screen.getByRole("button", { name: "Crear" }));
  expect(create).toHaveBeenCalledTimes(1);
});

test("error state preserves recovery actions without a confirmation provider", async () => {
  const retry = jest.fn();
  const back = jest.fn();
  await render(
    <ErrorState accessibleSizing message="Sin conexión" onBack={back} onRetry={retry} />,
  );
  expect(screen.getByText("Sin conexión").props.accessibilityLiveRegion).toBe("polite");
  await fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));
  await fireEvent.press(screen.getByRole("button", { name: "Volver" }));
  expect(retry).toHaveBeenCalledTimes(1);
  expect(back).toHaveBeenCalledTimes(1);
});

test("base action retains its accessible name while busy", async () => {
  const press = jest.fn();
  await render(<BaseButton accessibleSizing loading onPress={press} title="Guardar" />);
  const action = screen.getByRole("button", { name: "Guardar" });
  expect(action.props.accessibilityState).toEqual({ disabled: true, busy: true });
  await fireEvent.press(action);
  expect(press).not.toHaveBeenCalled();
});

test("base icon action carries the same target and supplied name", async () => {
  await render(
    <BaseButton.Icon accessibilityLabel="Más opciones" accessibleSizing icon="ellipsis" />,
  );
  expect(screen.getByRole("button", { name: "Más opciones" }).props.style).toMatchObject({
    minWidth: 48,
    minHeight: 48,
  });
});
