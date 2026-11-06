import { afterEach, expect, jest, test } from "@jest/globals";
import ListGroup from "@sincpro/mobile-ui/Display/Display.ListGroup";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import { DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { configureFonts, resetFonts } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as ReactNative from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);

afterEach(() => {
  resetFonts();
  setActiveTheme(DEFAULT_THEME);
});

test("grouping adds one header and separators only between visible rows", async () => {
  await render(
    <ListGroup footer="Ayuda del grupo" testID="group" title="Preferencias">
      <ListItem title="Primera" variant="mobile" />
      {false}
      <ListItem title="Segunda" variant="mobile" />
      {null}
      <ListItem title="Tercera" variant="mobile" />
    </ListGroup>,
  );
  expect(screen.getByRole("header", { name: "Preferencias" })).toBeTruthy();
  expect(screen.getByText("Ayuda del grupo")).toBeTruthy();
  expect(
    screen.getByTestId("group-separator-0", { includeHiddenElements: true }).props.style
      .height,
  ).toBe(ReactNative.StyleSheet.hairlineWidth);
  expect(
    screen.getByTestId("group-separator-1", { includeHiddenElements: true }),
  ).toBeTruthy();
  expect(
    screen.queryByTestId("group-separator-2", { includeHiddenElements: true }),
  ).toBeNull();
});

test("plain grouping and custom content classes preserve child actions", async () => {
  const onPress = jest.fn();
  await render(
    <ListGroup
      contentClassName="bg-bg-muted rounded-lg"
      separators={false}
      surface="plain"
      testID="group"
      title="Cuenta"
    >
      <ListItem onPress={onPress} title="Idioma" value="Español" variant="mobile" />
    </ListGroup>,
  );
  const row = screen.getByRole("button", { name: "Idioma" });
  expect(row.props.accessibilityValue.text).toBe("Español");
  await fireEvent.press(row);
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(screen.queryByTestId("group-separator-0")).toBeNull();
});

test("custom shape and surface classes replace defaults rather than compete with them", async () => {
  await render(
    <ListGroup contentClassName="bg-bg-muted rounded-lg" testID="custom" title="Cuenta">
      <ListItem title="Sincpro" variant="mobile" />
    </ListGroup>,
  );
  expect(screen.getByTestId("custom-content").props.className).toContain("bg-bg-muted");
  expect(screen.getByTestId("custom-content").props.className).toContain("rounded-lg");
  expect(screen.getByTestId("custom-content").props.className).not.toContain("bg-bg-card");
  expect(screen.getByTestId("custom-content").props.className).not.toContain("rounded-2xl");
});

test("mobile rows keep long text visible and reserve a 48 point touch target", async () => {
  await render(
    <ListItem
      onPress={jest.fn()}
      subtitle="Ayuda que no debe truncarse"
      title="Un título que se puede ampliar"
      variant="mobile"
    />,
  );
  expect(
    screen.getByText("Un título que se puede ampliar").props.numberOfLines,
  ).toBeUndefined();
  expect(screen.getByText("Ayuda que no debe truncarse").props.numberOfLines).toBeUndefined();
  expect(
    ReactNative.StyleSheet.flatten(screen.getByRole("button").props.style).minHeight,
  ).toBe(48);
  expect(
    ReactNative.StyleSheet.flatten(screen.getByRole("button").props.style).minWidth,
  ).toBe(48);
});

test("disabled mobile rows expose their state and do not run actions", async () => {
  const onPress = jest.fn();
  await render(
    <ListItem disabled onPress={onPress} title="No disponible" variant="mobile" />,
  );
  const row = screen.getByRole("button", { name: "No disponible" });
  expect(row.props.accessibilityState.disabled).toBe(true);
  await fireEvent.press(row);
  expect(onPress).not.toHaveBeenCalled();
});

test("legacy typography and single-line rows do not change", async () => {
  await render(<ListItem onPress={jest.fn()} title="Legacy" />);
  expect(screen.getByText("Legacy").props.numberOfLines).toBe(1);
  expect(
    ReactNative.StyleSheet.flatten(screen.getByText("Legacy").props.style).fontSize,
  ).toBe(14);
});

test("mobile rows omit their own separators by default but honor an explicit divider", async () => {
  const { rerender } = await render(
    <ListItem testID="row" title="Idioma" variant="mobile" />,
  );
  expect(screen.getByTestId("row").props.className).not.toContain("border-b");
  await rerender(<ListItem showDivider testID="row" title="Idioma" variant="mobile" />);
  expect(screen.getByTestId("row").props.className).toContain("border-b");
  await rerender(<ListItem testID="row" title="Idioma" />);
  expect(screen.getByTestId("row").props.className).toContain("border-b");
});

test("readable text remains opt-in and uses the configured brand font", async () => {
  configureFonts({ regular: "Brand-Regular" });
  await render(
    <>
      <Typography.Text variant="bodyReadable">Lectura</Typography.Text>
      <Typography.SelectableText value="Lectura seleccionable" variant="bodyReadable" />
      <Typography.Text>Legacy</Typography.Text>
    </>,
  );
  expect(
    ReactNative.StyleSheet.flatten(screen.getByText("Lectura").props.style),
  ).toMatchObject({ fontSize: 17, fontFamily: "Brand-Regular" });
  expect(
    ReactNative.StyleSheet.flatten(
      screen.getByDisplayValue("Lectura seleccionable").props.style,
    ),
  ).toMatchObject({ fontSize: 17, fontFamily: "Brand-Regular" });
  expect(
    ReactNative.StyleSheet.flatten(screen.getByText("Legacy").props.style).fontSize,
  ).toBe(14);
});

test("group header actions remain named and independent from row actions", async () => {
  const edit = jest.fn();
  const open = jest.fn();
  await render(
    <ListGroup action={{ label: "Editar grupo", onPress: edit }} title="Cuenta">
      <ListItem onPress={open} title="Abrir cuenta" variant="mobile" />
    </ListGroup>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Editar grupo" }));
  expect(edit).toHaveBeenCalledTimes(1);
  expect(open).not.toHaveBeenCalled();
});
