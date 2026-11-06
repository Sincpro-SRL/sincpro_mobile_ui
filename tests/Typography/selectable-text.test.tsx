import { afterEach, expect, jest, test } from "@jest/globals";
import { configureFonts, resetFonts } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { act, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

afterEach(() => resetFonts());

test("selectable text is read-only, multiline and does not summon the keyboard", async () => {
  await render(<Typography.SelectableText value="Texto para seleccionar" />);
  const text = screen.getByDisplayValue("Texto para seleccionar");
  expect(text.props).toMatchObject({
    editable: false,
    readOnly: true,
    multiline: true,
    scrollEnabled: false,
    showSoftInputOnFocus: false,
  });
  expect(StyleSheet.flatten(text.props.style)).toMatchObject({
    fontFamily: "IBMPlexSans_400Regular",
    padding: 0,
  });
});

test("both reading components preserve configured branded fonts", async () => {
  configureFonts({ regular: "Brand-Regular" });
  await render(
    <>
      <Typography.Text semibold>Texto de marca</Typography.Text>
      <Typography.SelectableText semibold value="Texto seleccionable de marca" />
    </>,
  );
  expect(StyleSheet.flatten(screen.getByText("Texto de marca").props.style).fontFamily).toBe(
    "Brand-Regular",
  );
  expect(
    StyleSheet.flatten(screen.getByDisplayValue("Texto seleccionable de marca").props.style)
      .fontFamily,
  ).toBe("Brand-Regular");
});

test("native selection changes can be observed without editing the value", async () => {
  const onSelectionChange = jest.fn();
  await render(
    <Typography.SelectableText
      onSelectionChange={onSelectionChange}
      value="Una descripción"
    />,
  );
  const event = { nativeEvent: { selection: { start: 4, end: 15 } } };
  await act(async () =>
    screen.getByDisplayValue("Una descripción").props.onSelectionChange(event),
  );
  expect(onSelectionChange).toHaveBeenCalledWith(event);
  expect(screen.getByDisplayValue("Una descripción")).toBeTruthy();
});
