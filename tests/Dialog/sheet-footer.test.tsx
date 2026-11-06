import { expect, jest, test } from "@jest/globals";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("keeps an optional footer visible alongside scrollable sheet content", async () => {
  await render(
    <Sheet
      footer={<Text>Confirmar filtros</Text>}
      onClose={() => {}}
      title="Filtros"
      visible
    >
      <Text>Contenido desplazable</Text>
    </Sheet>,
  );

  expect(screen.getByText("Contenido desplazable")).toBeTruthy();
  expect(screen.getByText("Confirmar filtros")).toBeTruthy();
});
