import { expect, jest, test } from "@jest/globals";
import RowItem from "@sincpro/mobile-ui/Navigation/Navigation.RowItem";
import { fontFamilies } from "@sincpro/mobile-ui/theme/typography";
import { render, screen, userEvent } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

const row = {
  item: { id: 1 },
  id: 1,
  index: 0,
  rowTitle: "Registro",
  rowSubtitle: "Detalle",
};

test("row callback prop takes precedence over the legacy item callback", async () => {
  const legacyPress = jest.fn();
  const press = jest.fn();
  await render(<RowItem item={{ ...row, onPress: legacyPress }} onPress={press} />);
  await userEvent.press(screen.getByText("Registro"));
  expect(press).toHaveBeenCalledTimes(1);
  expect(legacyPress).not.toHaveBeenCalled();
});

test("legacy embedded item callback remains supported", async () => {
  const press = jest.fn();
  await render(<RowItem item={{ ...row, onPress: press }} />);
  await userEvent.press(screen.getByText("Registro"));
  expect(press).toHaveBeenCalledTimes(1);
});

test.each(["prop", "item"] as const)(
  "readonly from %s prevents row activation",
  async (source) => {
    const press = jest.fn();
    await render(
      <RowItem
        item={{ ...row, readonly: source === "item", onPress: press }}
        onPress={press}
        readonly={source === "prop" ? true : undefined}
      />,
    );
    await userEvent.press(screen.getByText("Registro"));
    expect(press).not.toHaveBeenCalled();
  },
);

test("default row reads like Content.Row and drops an empty subtitle", async () => {
  await render(<RowItem item={{ ...row, rowSubtitle: undefined }} />);
  const title = screen.getByText("Registro");
  expect(StyleSheet.flatten(title.props.style)).toMatchObject({
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  });
  expect(title.props.numberOfLines).toBe(1);
  expect(screen.queryByText("Detalle")).toBeNull();
});
