import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Icon, { type IconProps } from "@sincpro/mobile-ui/Display/Display.Icon";
import { ICON_FONT_FAMILY } from "@sincpro/mobile-ui/Display/icon-font";
import { MATERIAL_CODEPOINTS } from "@sincpro/mobile-ui/Display/icon-glyphs";
import { ICON_MAP, type IconName } from "@sincpro/mobile-ui/Display/icon-map";
import { registerIcons } from "@sincpro/mobile-ui/Display/icon-registry";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, render, screen } from "@testing-library/react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Platform, StyleSheet, Text } from "react-native";

jest.mock("expo-symbols", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Platform: MockPlatform, Text: MockText } =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    SymbolView: jest.fn(
      ({
        name,
        tintColor,
        size,
        accessible,
        accessibilityElementsHidden,
        importantForAccessibility,
      }: SymbolViewProps) =>
        mockReact.createElement(MockText, {
          accessible,
          accessibilityElementsHidden,
          importantForAccessibility,
          testID: "native-symbol",
          style: { color: tintColor, fontSize: size },
          children:
            typeof name === "string"
              ? name
              : MockPlatform.OS === "ios"
                ? name.ios
                : MockPlatform.OS === "android"
                  ? name.android
                  : name.web,
        }),
    ),
  };
});

function getNativeSymbol() {
  return screen.getByTestId("native-symbol", { includeHiddenElements: true });
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  jest.restoreAllMocks();
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("default icon color follows live theme changes without remounting", async () => {
  await render(<Icon name="document" size={20} />);
  expect(getNativeSymbol().props.style).toMatchObject({
    color: DEFAULT_THEME.text.primary,
    fontSize: 20,
  });
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(getNativeSymbol().props.style.color).toBe(DEFAULT_DARK_THEME.text.primary);
});

test("explicit icon color and size remain consumer controlled", async () => {
  await render(<Icon color="#123ABC" name="home" size={18} />);
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(getNativeSymbol().props.style).toMatchObject({
    color: "#123ABC",
    fontSize: 18,
  });
});

test("iOS draws the native SF Symbol", async () => {
  jest.replaceProperty(Platform, "OS", "ios");
  await render(<Icon name="home" />);
  expect(jest.mocked(SymbolView).mock.lastCall?.[0]).toMatchObject({
    name: ICON_MAP.home.sf,
    size: 24,
  });
});

test.each(["android", "web"] as const)(
  "%s draws one Material glyph that does not grow with the system font scale",
  async (platform) => {
    jest.replaceProperty(Platform, "OS", platform);
    await render(<Icon color="#123ABC" name="home" size={18} testID="icon" />);
    expect(SymbolView).not.toHaveBeenCalled();
    const glyph = screen.getByText(String.fromCharCode(MATERIAL_CODEPOINTS.home), {
      includeHiddenElements: true,
    });
    expect(glyph.props.allowFontScaling).toBe(false);
    expect(StyleSheet.flatten(glyph.props.style)).toMatchObject({
      fontFamily: ICON_FONT_FAMILY,
      fontSize: 18,
      lineHeight: 18,
      color: "#123ABC",
    });
  },
);

test("named icons preserve styles, view props and accessibility without duplicate glyphs", async () => {
  await render(
    <Icon
      accessibilityHint="Abre la pantalla principal"
      accessibilityLabel="Inicio"
      accessibilityState={{ selected: true }}
      className="p-2"
      name="home"
      style={[{ opacity: 0.5 }, { marginLeft: 4 }]}
      testID="home-icon"
    />,
  );
  const icon = screen.getByRole("image", { name: "Inicio" });
  expect(icon.props.testID).toBe("home-icon");
  expect(icon.props.accessibilityHint).toBe("Abre la pantalla principal");
  expect(icon.props.accessibilityState).toEqual({ selected: true });
  expect(StyleSheet.flatten(icon.props.style)).toMatchObject({
    opacity: 0.5,
    marginLeft: 4,
  });
  expect(jest.mocked(SymbolView).mock.lastCall?.[0]).toMatchObject({
    accessible: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants",
  });
});

test("decorative icons stay unfocusable and accessibility overrides are retained", async () => {
  const result = await render(<Icon name="home" testID="icon" />);
  expect(screen.getByTestId("icon").props.accessible).toBe(false);
  expect(screen.getByTestId("icon").props.accessibilityRole).toBeUndefined();
  await result.rerender(
    <Icon
      accessibilityLabel="Inicio"
      accessibilityRole="button"
      accessible={false}
      name="home"
      testID="icon"
    />,
  );
  expect(screen.getByTestId("icon").props.accessible).toBe(false);
  expect(screen.getByTestId("icon").props.accessibilityRole).toBe("button");
});

test.each(["home-outline", "house.fill", "ionicons", "toString", "__proto__", "", null, 4])(
  "unknown icon name %p shows the fallback and reports it once instead of crashing the screen",
  async (name) => {
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const props: Record<string, unknown> = { name };
    await render(<Icon name="home" {...props} />);
    await render(<Icon name="home" {...props} />);
    expect(jest.mocked(SymbolView).mock.lastCall?.[0]).toMatchObject({
      name: ICON_MAP.info.sf,
    });
    const reports = error.mock.calls.filter(([message]) =>
      String(message).includes("Unknown icon"),
    );
    expect(reports).toHaveLength(1);
  },
);

test.each(["type", "customIcon", "fallback", "children"])(
  "legacy %s prop is reported and ignored",
  async (key) => {
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const props: Record<string, unknown> = { [key]: "legacy" };
    await render(<Icon name="home" testID="icon" {...props} />);
    expect(screen.queryByText("legacy", { includeHiddenElements: true })).toBeNull();
    expect(
      screen.getByTestId("icon").props[key === "children" ? "legacy" : key],
    ).toBeUndefined();
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`"${key}" is not supported`));
  },
);

test.each([0, -1, NaN, Infinity])("invalid size %p falls back to 24", async (size) => {
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  await render(<Icon name="home" size={size} />);
  expect(jest.mocked(SymbolView).mock.lastCall?.[0]).toMatchObject({ size: 24 });
});

test("registered app icons render through the same component", async () => {
  registerIcons({
    brand: ({ size, color }: { size: number; color: unknown }) => (
      <Text testID="brand-glyph">{`${size}:${String(color)}`}</Text>
    ),
  } as Parameters<typeof registerIcons>[0]);
  const brand = "brand" as IconName;
  await render(<Icon color="#FF0000" name={brand} size={30} />);
  expect(screen.getByTestId("brand-glyph").props.children).toBe("30:#FF0000");
  expect(SymbolView).not.toHaveBeenCalled();
});

test("public contract requires semantic names and excludes family and renderer props", () => {
  const contract: {
    requiresName: Pick<IconProps, "name"> extends Required<Pick<IconProps, "name">>
      ? true
      : false;
    semanticName: IconProps["name"] extends IconName ? true : false;
    acceptsAnyString: string extends IconProps["name"] ? true : false;
    legacyProps: Extract<
      keyof IconProps,
      "type" | "customIcon" | "fallback" | "children"
    > extends never
      ? false
      : true;
    legacyName: "home-outline" extends IconName ? true : false;
  } = {
    requiresName: true,
    semanticName: true,
    acceptsAnyString: false,
    legacyProps: false,
    legacyName: false,
  };
  expect(contract).toEqual({
    requiresName: true,
    semanticName: true,
    acceptsAnyString: false,
    legacyProps: false,
    legacyName: false,
  });
});
