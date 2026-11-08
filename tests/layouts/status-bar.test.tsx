import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { act, render } from "@testing-library/react-native";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import Container from "@sincpro/mobile-ui/layouts/Container";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import CollapsingHeader from "@sincpro/mobile-ui/Navigation/Navigation.CollapsingHeader";
import { setActiveTheme } from "@sincpro/mobile-ui/theme/active";
import { DEFAULT_DARK_THEME } from "@sincpro/mobile-ui/theme/dark";
import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import { StatusBar, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-keyboard-controller", () => {
  const mockReact = require("react");
  const { View } = require("react-native");
  const Container = ({ children, ...props }: { children: React.ReactNode }) =>
    mockReact.createElement(View, props, children);
  return {
    KeyboardAwareScrollView: Container,
    KeyboardStickyView: Container,
    FocusedInputEvents: { addListener: () => ({ remove: () => undefined }) },
    KeyboardController: { setFocusTo: jest.fn(), dismiss: jest.fn() },
    useKeyboardState: () => false,
    KeyboardToolbar: Object.assign(Container, {
      Group: Container,
      Prev: Container,
      Next: Container,
      Done: Container,
    }),
  };
});
jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { Icon: () => null },
}));
jest.mock("@sincpro/mobile-ui/Form/Form.KeyboardForm", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return ({ children }: { children: React.ReactNode }) =>
    mockReact.createElement(View, null, children);
});
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: require("react-native").View,
  useSafeAreaInsets: () => ({ top: 24, bottom: 20, left: 0, right: 0 }),
}));

beforeEach(() => setActiveTheme(DEFAULT_THEME));
afterEach(() => {
  jest.restoreAllMocks();
  setActiveTheme(DEFAULT_THEME);
});

test.each(["container", "scroll", "auth", "app-bar", "collapsing"] as const)(
  "%s leaves all system-bar ownership to the host in both themes",
  async (kind) => {
    const push = jest.spyOn(StatusBar, "pushStackEntry");
    const replace = jest.spyOn(StatusBar, "replaceStackEntry");
    const content = <Text>Contenido</Text>;
    const screen = {
      container: <Container>{content}</Container>,
      scroll: <ScrollContainer>{content}</ScrollContainer>,
      auth: <AuthContainer header={<Text>Logo</Text>}>{content}</AuthContainer>,
      "app-bar": <AppBar title="Eventos" />,
      collapsing: (
        <CollapsingHeader.Root>
          <CollapsingHeader title="Eventos" />
          <CollapsingHeader.ScrollView>{content}</CollapsingHeader.ScrollView>
        </CollapsingHeader.Root>
      ),
    }[kind];
    await render(screen);
    await act(() => setActiveTheme(DEFAULT_DARK_THEME));
    expect(push).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  },
);

test("a header and its container reserve top once and never add the tab-bar bottom", async () => {
  const screen = await render(
    <Container>
      <AppBar testID="screen-header" title="Eventos" />
      <Text>Contenido</Text>
    </Container>,
  );
  expect(screen.getByTestId("screen-header")).toHaveStyle({ paddingTop: 24 });
  const safeArea = screen.root?.queryAll((node) => node.props.edges, { includeSelf: true })[0];
  expect(safeArea?.props.edges).toEqual(["left", "right"]);
});

test("embedded headers leave top ownership with their screen", async () => {
  const screen = await render(<AppBar safeArea={false} testID="embedded-header" title="Eventos" />);
  expect(screen.getByTestId("embedded-header")).toHaveStyle({ paddingTop: 0 });
});
