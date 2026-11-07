import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import Icon, { type IconProps } from "@sincpro/mobile-ui/Display/Display.Icon";
import { ICON_MAP, type IconName } from "@sincpro/mobile-ui/Display/icon-map";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, render, screen } from "@testing-library/react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Platform, StyleSheet } from "react-native";

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

test.each(["ios", "android", "web"] as const)(
  "%s receives its own native source, never an SF-only or fallback icon",
  async (platform) => {
    jest.replaceProperty(Platform, "OS", platform);
    await render(<Icon name="home" />);
    expect(jest.mocked(SymbolView).mock.lastCall?.[0]).toMatchObject({
      name: {
        ios: ICON_MAP.home.sf,
        android: ICON_MAP.home.md,
        web: ICON_MAP.home.md,
      },
      size: 24,
    });
    expect(getNativeSymbol().props.children).toBe(
      platform === "ios" ? ICON_MAP.home.sf : ICON_MAP.home.md,
    );
    expect(jest.mocked(SymbolView).mock.lastCall?.[0]).not.toHaveProperty("fallback");
    expect(jest.mocked(SymbolView).mock.lastCall?.[0]).not.toHaveProperty("type");
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

test.each([
  "home-outline",
  "house.fill",
  "arrow_back",
  "ionicons",
  "toString",
  "constructor",
  "__proto__",
  "",
  null,
  undefined,
  4,
])("invalid JavaScript icon name %p fails explicitly", async (name) => {
  const props: Record<string, unknown> = { name };
  await expect(render(<Icon name="home" {...props} />)).rejects.toThrow("Unknown icon name");
});

test.each(["type", "customIcon", "fallback", "children"])(
  "removed JavaScript %s prop is rejected, not silently ignored",
  async (key) => {
    const props: Record<string, unknown> = { [key]: "legacy" };
    await expect(render(<Icon name="home" {...props} />)).rejects.toThrow(
      "Display.Icon accepts semantic names, not icon families or custom renderers",
    );
  },
);

test.each([0, -1, NaN, Infinity, "24"])(
  "invalid icon size %p fails explicitly",
  async (size) => {
    const props: Record<string, unknown> = { size };
    await expect(render(<Icon name="home" {...props} />)).rejects.toThrow(
      "Invalid icon size",
    );
  },
);

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
