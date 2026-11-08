import { expect, jest, test } from "@jest/globals";
import { countLabel, CountBadge } from "@sincpro/mobile-ui/Display/count-badge";
import Badge from "@sincpro/mobile-ui/Display/Display.Badge";
import Chip from "@sincpro/mobile-ui/Display/Display.Chip";
import IconBadge from "@sincpro/mobile-ui/Display/Display.IconBadge";
import Tag from "@sincpro/mobile-ui/Display/Display.Tag";
import { fontFamilies } from "@sincpro/mobile-ui/theme/typography";
import { render, screen } from "@testing-library/react-native";
import { StyleSheet, View } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

test.each([
  ["Badge", <Badge key="b" label="Pagada" variant="success" />, fontFamilies.semiBold],
  ["Chip", <Chip key="c" label="DEV" tone="warning" />, fontFamilies.medium],
  ["Tag", <Tag key="t" label="Vegano" />, fontFamilies.medium],
] as const)("%s labels share the pill metrics and the DS font", async (_, element, family) => {
  await render(element);
  const label = screen.getByText(/Pagada|DEV|Vegano/);
  expect(StyleSheet.flatten(label.props.style)).toMatchObject({
    fontSize: 10,
    lineHeight: 16,
    fontFamily: family,
  });
  expect(label.props.numberOfLines).toBe(1);
});

test("count labels cap at max and keep short text as is", () => {
  expect(countLabel(3, 99)).toBe("3");
  expect(countLabel(120, 99)).toBe("99+");
  expect(countLabel("Nuevo", 99)).toBe("Nuevo");
});

test("icon badge shows the capped count, a dot, or nothing", async () => {
  const { rerender } = await render(
    <IconBadge count={120}>
      <View />
    </IconBadge>,
  );
  expect(screen.getByText("99+")).toBeTruthy();

  await rerender(
    <IconBadge count={0}>
      <View />
    </IconBadge>,
  );
  expect(screen.queryByText("0")).toBeNull();
});

test("count badge never renders an empty bubble", async () => {
  await render(<CountBadge count="" />);
  expect(screen.toJSON()).toBeNull();
});
