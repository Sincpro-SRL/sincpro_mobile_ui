import { expect, jest, test } from "@jest/globals";
import StatusBadge, {
  defineStatuses,
  resolveStatus,
} from "@sincpro/mobile-ui/Display/Display.StatusBadge";
import { render, screen } from "@testing-library/react-native";

const INVOICE_STATUS = defineStatuses({
  draft: { label: "Borrador", tone: "info" },
  paid: { label: "Pagada", tone: "success", icon: "success" },
  cancel: { label: "Anulada", tone: "danger", icon: "error" },
});

test("a domain state renders its label from one shared table", async () => {
  await render(<StatusBadge status="paid" statuses={INVOICE_STATUS} />);
  expect(screen.getByText("Pagada")).toBeTruthy();
});

test("rows read label, tone and icon from the same table", () => {
  expect(resolveStatus(INVOICE_STATUS, "cancel")).toEqual({
    label: "Anulada",
    tone: "danger",
    icon: "error",
  });
});

test("an unknown state shows its raw value instead of crashing and warns once", async () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  await render(<StatusBadge status="posted" statuses={INVOICE_STATUS} />);
  await render(<StatusBadge status="posted" statuses={INVOICE_STATUS} />);
  expect(screen.getByText("posted")).toBeTruthy();
  expect(warn).toHaveBeenCalledTimes(1);
  expect(resolveStatus(INVOICE_STATUS, null).label).toBe("—");
  warn.mockRestore();
});

test("the table is frozen so a screen cannot mutate shared states", () => {
  expect(Object.isFrozen(INVOICE_STATUS)).toBe(true);
});
