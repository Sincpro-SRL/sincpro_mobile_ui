import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { GroupedSettings } from "../../.rnstorybook/stories/Forms.Settings.stories";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("settings expose a single notification control and language changes after choosing", async () => {
  await render(<GroupedSettings />);
  await fireEvent.press(screen.getByRole("checkbox", { name: "Recibir avisos importantes" }));
  expect(screen.getByText("Los avisos están desactivados")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Cambiar idioma" }));
  await fireEvent.press(screen.getByRole("button", { name: "English" }));
  expect(screen.getByText("English")).toBeTruthy();
});

test("canceling language selection keeps the previous value", async () => {
  await render(<GroupedSettings customized long />);
  await fireEvent.press(screen.getByRole("button", { name: "Cambiar idioma" }));
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByText("Español")).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Resumen semanal no disponible" }).props
      .accessibilityState.disabled,
  ).toBe(true);
});
