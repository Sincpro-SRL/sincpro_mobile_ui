import { expect, jest, test } from "@jest/globals";
import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test("empty without a title keeps the original no-records look of the templates", async () => {
  await render(<Feedback.State kind="empty" />);
  expect(screen.getByText("No se encontraron registros disponibles.")).toBeTruthy();
});

test("empty with a title becomes the configurable empty state with its action", async () => {
  const create = jest.fn();
  await render(
    <Feedback.State
      actionLabel="Crear pedido"
      description="Todavía no hay pedidos."
      kind="empty"
      onAction={create}
      title="Sin pedidos"
    />,
  );
  expect(screen.getByRole("header", { name: "Sin pedidos" })).toBeTruthy();
  await fireEvent.press(screen.getByText("Crear pedido"));
  expect(create).toHaveBeenCalledTimes(1);
});

test("error offers retry and loading announces its message", async () => {
  const retry = jest.fn();
  const { rerender } = await render(
    <Feedback.State kind="error" message="Sin conexión" onRetry={retry} />,
  );
  expect(screen.getByText("Sin conexión")).toBeTruthy();
  await fireEvent.press(screen.getByText("Reintentar"));
  expect(retry).toHaveBeenCalledTimes(1);
  await rerender(<Feedback.State kind="loading" message="Cargando pedidos" />);
  expect(screen.getByText("Cargando pedidos")).toBeTruthy();
});
