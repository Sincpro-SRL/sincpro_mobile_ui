import { expect, test } from "@jest/globals";
import AmountSummary from "@sincpro/mobile-ui/Display/Display.AmountSummary";
import { render, screen } from "@testing-library/react-native";

test("renders labeled amount rows and a total using the shared currency", async () => {
  await render(
    <AmountSummary.Root currencySymbol="Bs">
      <AmountSummary.Row label="Subtotal" testID="subtotal" value={120} />
      <AmountSummary.Row
        currencySymbol="$"
        label="Descuento"
        prefix="-"
        value={10}
      />
      <AmountSummary.Total label="Total" testID="total" value={110} />
    </AmountSummary.Root>,
  );

  expect(screen.getByText("Subtotal")).toBeTruthy();
  expect(screen.getByText("Descuento")).toBeTruthy();
  expect(screen.getByText("Total")).toBeTruthy();
  expect(screen.getByText(/120,00/)).toBeTruthy();
  expect(screen.getByText(/110,00/)).toBeTruthy();
  expect(screen.getByTestId("subtotal")).toBeTruthy();
  expect(screen.getByTestId("total")).toBeTruthy();
});
