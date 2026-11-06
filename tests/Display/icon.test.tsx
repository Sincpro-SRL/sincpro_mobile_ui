import { afterEach, expect, jest, test } from "@jest/globals";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { DEFAULT_DARK_THEME, DEFAULT_THEME, setActiveTheme } from "@sincpro/mobile-ui/theme";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@expo/vector-icons", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text: MockText } =
    jest.requireActual<typeof import("react-native")>("react-native");
  const Glyph = ({ color, size, name }: { color: string; size: number; name: string }) =>
    mockReact.createElement(MockText, { testID: name, style: { color, fontSize: size } });
  return {
    Ionicons: Glyph,
    AntDesign: Glyph,
    Feather: Glyph,
    FontAwesome: Glyph,
    FontAwesome5: Glyph,
    MaterialCommunityIcons: Glyph,
    MaterialIcons: Glyph,
    SimpleLineIcons: Glyph,
  };
});

afterEach(async () => {
  await act(() => setActiveTheme(DEFAULT_THEME));
});

test("default icon color follows live theme changes without remounting", async () => {
  await render(<Icon name="document" size={20} />);
  expect(screen.getByTestId("document").props.style).toMatchObject({
    color: DEFAULT_THEME.text.primary,
    fontSize: 20,
  });
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(screen.getByTestId("document").props.style.color).toBe(
    DEFAULT_DARK_THEME.text.primary,
  );
});

test("explicit icon colors and custom renderers remain consumer controlled", async () => {
  const Custom = ({ color, size }: { color?: string; size?: number }) => (
    <Text style={{ color, fontSize: size }} testID="custom-icon" />
  );
  await render(
    <>
      <Icon color="#123ABC" name="fixed" />
      <Icon customIcon={Custom} size={18} type="custom" />
    </>,
  );
  await act(() => setActiveTheme(DEFAULT_DARK_THEME));
  expect(screen.getByTestId("fixed").props.style.color).toBe("#123ABC");
  expect(screen.getByTestId("custom-icon").props.style).toMatchObject({
    color: DEFAULT_DARK_THEME.text.primary,
    fontSize: 18,
  });
});
