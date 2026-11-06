import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { MobileRecords, MobileSelection } from "../../.rnstorybook/stories/UX.Mobile.stories";

jest.mock("@sincpro/mobile-ui/Dialog/Confirmation.context", () => ({
  useConfirmationContext: () => ({ show: jest.fn(), hide: jest.fn() }),
}));
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@sincpro/mobile-ui/Dialog/Dialog.NativeSheet", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ visible, children }: { visible: boolean; children: React.ReactNode }) => visible ? mockReact.createElement(View, {}, children) : null,
  };
});

test("an explicit options action can archive and undo without a swipe gesture", async () => {
  await render(<MobileRecords />);
  await fireEvent.press(screen.getByRole("button", { name: "Opciones del registro" }));
  await fireEvent.press(screen.getByRole("button", { name: "Archivar registro" }));
  expect(screen.queryByRole("button", { name: "Abrir resumen del registro" })).toBeNull();
  expect(screen.getByText("Registro archivado. Puedes deshacer esta acción.")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Deshacer archivo" }));
  expect(screen.getByRole("button", { name: "Abrir resumen del registro" })).toBeTruthy();
});

test("filter drafts do not change the list until Apply and dismiss discards them", async () => {
  await render(<MobileRecords />);
  await fireEvent.press(screen.getByRole("button", { name: "Opciones del registro" }));
  await fireEvent.press(screen.getByRole("button", { name: "Marcar como completado" }));
  await fireEvent.press(screen.getByRole("button", { name: "Filtrar registros" }));
  await fireEvent.press(screen.getByRole("checkbox", { name: "Solo pendientes" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.getByRole("button", { name: "Abrir resumen del registro" })).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Filtrar registros" }));
  expect(screen.getByRole("checkbox", { name: "Solo pendientes" }).props.accessibilityState.checked).toBe(false);
  await fireEvent.press(screen.getByRole("checkbox", { name: "Solo pendientes" }));
  await fireEvent.press(screen.getByRole("button", { name: "Aplicar filtros" }));
  expect(screen.getByText("Sin resultados")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Abrir resumen del registro" })).toBeNull();
});

test("selection is communicated after choosing a mobile-sheet option", async () => {
  await render(<MobileSelection />);
  await fireEvent.press(screen.getByRole("button", { name: "Canal de aviso: Seleccionar…" }));
  await fireEvent.press(screen.getByRole("menuitem", { name: "Correo electrónico" }));
  expect(screen.getByText("Canal elegido: Correo electrónico")).toBeTruthy();
});
