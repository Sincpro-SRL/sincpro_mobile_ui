import { expect, jest, test } from "@jest/globals";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: () => ({ width: 320, height: 844, scale: 3, fontScale: 2 }),
}));

test.each(["default", "mobile"] as const)(
  "%s list items default to 48 point targets and scaled multiline text",
  async (variant) => {
    const onPress = jest.fn();
    const title = "Todos los registros pendientes de sincronización";
    const subtitle = "La información se guardará cuando tengas conexión";
    await render(
      <ListItem
        onPress={onPress}
        style={{ paddingVertical: 16 }}
        subtitle={subtitle}
        testID="row"
        title={title}
        titleTextProps={{ style: { fontSize: 20, lineHeight: 28 } }}
        value="Pendiente de revisión"
        variant={variant}
      />,
    );
    const row = screen.getByTestId("row");
    expect(StyleSheet.flatten(row.props.style)).toMatchObject({
      minHeight: 48,
      minWidth: 48,
      paddingVertical: 16,
    });
    for (const text of [title, subtitle]) {
      expect(screen.getByText(text).props.numberOfLines).toBeUndefined();
      expect(screen.getByText(text).props.allowFontScaling).not.toBe(false);
    }
    expect(StyleSheet.flatten(screen.getByText(title).props.style)).toMatchObject({
      fontSize: 20,
      lineHeight: 28,
    });
    await fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  },
);

test("list item text settings remain configurable and disabled rows cannot activate", async () => {
  const onPress = jest.fn();
  await render(
    <ListItem
      disabled
      onPress={onPress}
      testID="row"
      title="Resumen"
      titleTextProps={{ numberOfLines: 2 }}
    />,
  );
  expect(screen.getByText("Resumen").props.numberOfLines).toBe(2);
  await fireEvent.press(screen.getByTestId("row"));
  expect(onPress).not.toHaveBeenCalled();
});
