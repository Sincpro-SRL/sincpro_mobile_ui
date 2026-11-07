import { afterEach, expect, jest, test } from "@jest/globals";
import ListGroup from "@sincpro/mobile-ui/Display/Display.ListGroup";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import { DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import {
  configureFonts,
  fontFamilies,
  resetFonts,
} from "@sincpro/mobile-ui/theme/typography";
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
    ReactNative.StyleSheet.flatten(
      screen.getByTestId("group-separator-0", { includeHiddenElements: true }).props.style,
    ).height,
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

test("default rows wrap text and use accessible targets without changing typography", async () => {
  await render(<ListItem onPress={jest.fn()} subtitle="Ayuda" title="Fila" />);
  expect(screen.getByText("Fila").props.numberOfLines).toBeUndefined();
  expect(screen.getByText("Ayuda").props.numberOfLines).toBeUndefined();
  expect(
    ReactNative.StyleSheet.flatten(screen.getByRole("button").props.style),
  ).toMatchObject({ minHeight: 48, minWidth: 48 });
  expect(ReactNative.StyleSheet.flatten(screen.getByText("Fila").props.style).fontSize).toBe(
    14,
  );
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

test("compact groups distinguish section, regular row and quiet supporting roles", async () => {
  await render(
    <ListGroup description="Descripción" footer="Pie" title="Sección">
      <ListItem subtitle="Ayuda" title="Fila" value="Dato" variant="mobile" />
    </ListGroup>,
  );
  const textStyle = (text: string) =>
    ReactNative.StyleSheet.flatten(screen.getByText(text).props.style);
  expect(textStyle("Sección")).toMatchObject({ fontSize: 16 });
  expect(textStyle("Fila")).toMatchObject({
    fontSize: 14,
    fontWeight: "400",
    fontFamily: fontFamilies.regular,
  });
  expect(textStyle("Sección").fontFamily).not.toBe(textStyle("Fila").fontFamily);
  for (const text of ["Descripción", "Ayuda", "Pie"]) {
    expect(textStyle(text)).toMatchObject({ fontSize: 13, fontWeight: "400" });
    expect(screen.getByText(text).props.className).toContain("text-text-secondary");
  }
  expect(textStyle("Dato")).toMatchObject({ fontSize: 14, fontWeight: "400" });
});

test("comfortable mobile density explicitly preserves the previous 17/16 reading roles", async () => {
  await render(
    <ListItem
      density="comfortable"
      subtitle="Ayuda"
      title="Lectura"
      value="Valor"
      variant="mobile"
    />,
  );
  for (const text of ["Lectura", "Valor"]) {
    expect(ReactNative.StyleSheet.flatten(screen.getByText(text).props.style).fontSize).toBe(
      17,
    );
  }
  expect(ReactNative.StyleSheet.flatten(screen.getByText("Ayuda").props.style).fontSize).toBe(
    16,
  );
});

test("text and container overrides use native style precedence without losing content or actions", async () => {
  const open = jest.fn();
  const styles = ReactNative.StyleSheet.create({ title: { fontSize: 19, lineHeight: 26 } });
  await render(
    <ListGroup
      footer="Personalizado"
      footerTextProps={{ style: { fontSize: 12, fontStyle: "italic" } }}
      headerProps={{ titleTextProps: { variant: "h4", style: { fontSize: 21 } } }}
      title="Mi sección"
    >
      <ListItem
        onPress={open}
        style={{ borderRadius: 24 }}
        subtitle="Mi ayuda"
        subtitleTextProps={{ style: { fontFamily: "Brand-Reading", fontSize: 15 } }}
        title="Mi fila"
        titleTextProps={{ semibold: true, style: [styles.title, [{ fontSize: 18 }]] }}
        value="Mi valor"
        valueTextProps={{ variant: "caption", style: { fontSize: 12 } }}
        variant="mobile"
      />
    </ListGroup>,
  );
  const style = (text: string) =>
    ReactNative.StyleSheet.flatten(screen.getByText(text).props.style);
  expect(style("Mi sección").fontSize).toBe(21);
  expect(screen.getByRole("header", { name: "Mi sección" })).toBeTruthy();
  expect(style("Mi fila")).toMatchObject({ fontSize: 18, lineHeight: 26 });
  expect(style("Mi ayuda")).toMatchObject({ fontSize: 15, fontFamily: "Brand-Reading" });
  expect(style("Mi valor").fontSize).toBe(12);
  expect(style("Personalizado")).toMatchObject({ fontSize: 12, fontStyle: "italic" });
  expect(
    ReactNative.StyleSheet.flatten(screen.getByRole("button").props.style),
  ).toMatchObject({
    borderRadius: 24,
    minHeight: 48,
    minWidth: 48,
  });
  await fireEvent.press(screen.getByRole("button", { name: "Mi fila" }));
  expect(open).toHaveBeenCalledTimes(1);
});

test("group and header styles remain independently extensible", async () => {
  const edit = jest.fn();
  await render(
    <ListGroup
      action={{ label: "Editar", onPress: edit }}
      contentStyle={{ borderRadius: 6, paddingVertical: 3 }}
      headerProps={{
        testID: "custom-header",
        style: { paddingHorizontal: 10 },
        contentStyle: { gap: 6 },
        actionStyle: { borderRadius: 20 },
        actionTextProps: { style: { fontFamily: "Brand-Action", fontSize: 15 } },
      }}
      separatorStyle={{ marginHorizontal: 6, backgroundColor: "purple" }}
      style={{ gap: 10 }}
      testID="custom-group"
      title="Mi grupo"
    >
      <ListItem title="Primera" variant="mobile" />
      <ListItem title="Segunda" variant="mobile" />
    </ListGroup>,
  );
  expect(
    ReactNative.StyleSheet.flatten(screen.getByTestId("custom-group").props.style),
  ).toMatchObject({ gap: 10 });
  expect(
    ReactNative.StyleSheet.flatten(screen.getByTestId("custom-group-content").props.style),
  ).toMatchObject({ borderRadius: 6, paddingVertical: 3 });
  expect(
    ReactNative.StyleSheet.flatten(screen.getByTestId("custom-header").props.style),
  ).toMatchObject({ paddingHorizontal: 10 });
  expect(
    ReactNative.StyleSheet.flatten(
      screen.getByTestId("custom-group-separator-0", { includeHiddenElements: true }).props
        .style,
    ),
  ).toMatchObject({ marginHorizontal: 6, backgroundColor: "purple" });
  expect(
    ReactNative.StyleSheet.flatten(screen.getByText("Editar").props.style),
  ).toMatchObject({ fontFamily: "Brand-Action", fontSize: 15 });
  expect(
    ReactNative.StyleSheet.flatten(
      screen.getByRole("button", { name: "Editar" }).props.style,
    ),
  ).toMatchObject({ borderRadius: 20, minHeight: 48 });
  await fireEvent.press(screen.getByRole("button", { name: "Editar" }));
  expect(edit).toHaveBeenCalledTimes(1);
});
