import { expect, jest, test } from "@jest/globals";
import { RecordDetail } from "../../.rnstorybook/stories/Records.Detail.stories";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("@sincpro/mobile-ui/Dialog/Confirmation.context", () => ({
  useConfirmationContext: () => ({ show: jest.fn(), hide: jest.fn() }),
}));

test("opens a record, edits it and returns to the updated list", async () => {
  await render(<RecordDetail startInList />);
  await fireEvent.press(screen.getByRole("button", { name: "Ver ORD-000123" }));
  await fireEvent.press(screen.getByRole("button", { name: "Editar cliente" }));
  await fireEvent.changeText(
    screen.getByLabelText("Nombre del cliente"),
    "Cliente actualizado",
  );
  await fireEvent.press(screen.getByRole("button", { name: "Guardar cambios" }));
  expect(screen.getByText("Cambios guardados")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Volver a registros" }));
  expect(screen.getByText("Cliente actualizado")).toBeTruthy();
});

test("a recoverable failure retains edits and retry succeeds", async () => {
  await render(<RecordDetail fail />);
  await fireEvent.press(screen.getByRole("button", { name: "Editar cliente" }));
  await fireEvent.changeText(
    screen.getByLabelText("Nombre del cliente"),
    "Cambio conservado",
  );
  await fireEvent.press(screen.getByRole("button", { name: "Guardar cambios" }));
  expect(screen.queryByText("Cambios guardados")).toBeNull();
  expect(screen.getByDisplayValue("Cambio conservado")).toBeTruthy();
  expect(
    screen.getByText("No se pudo guardar. Tus cambios se conservan; puedes reintentar."),
  ).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Reintentar guardar" }));
  expect(screen.getByText("Cambios guardados")).toBeTruthy();
});

test("empty input is rejected and cancel restores the original record", async () => {
  await render(<RecordDetail />);
  await fireEvent.press(screen.getByRole("button", { name: "Editar cliente" }));
  await fireEvent.changeText(screen.getByLabelText("Nombre del cliente"), " ");
  await fireEvent.press(screen.getByRole("button", { name: "Guardar cambios" }));
  expect(screen.getByText("Escribe el nombre del cliente.")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByText("Cliente de ejemplo")).toBeTruthy();
  expect(screen.queryByText("Cambios guardados")).toBeNull();
});
