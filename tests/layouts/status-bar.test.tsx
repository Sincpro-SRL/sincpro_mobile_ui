import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { act, render } from "@testing-library/react-native";
import Container from "@sincpro/mobile-ui/layouts/Container";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import ScreenStatusBar from "@sincpro/mobile-ui/layouts/ScreenStatusBar";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { setActiveTheme } from "@sincpro/mobile-ui/theme/active";
import { contrastRatio } from "@sincpro/mobile-ui/theme/contrast";
import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import { DEFAULT_DARK_THEME } from "@sincpro/mobile-ui/theme/dark";
import { StatusBar, Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
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
  useSafeAreaInsets: () => ({ top: 24, bottom: 0, left: 0, right: 0 }),
}));

beforeEach(() => setActiveTheme(DEFAULT_THEME));
afterEach(() => {
  jest.restoreAllMocks();
  setActiveTheme(DEFAULT_THEME);
});

test.each(["#FFFFFF", "#000000", "#777777", "#0C4A6E", "#F59E0B"])(
  "status bar chooses icons meeting 4.5:1 contrast on %s",
  async (backgroundColor) => {
    const push = jest.spyOn(StatusBar, "pushStackEntry");
    await render(<ScreenStatusBar backgroundColor={backgroundColor} />);
    const style: unknown = Reflect.get(push.mock.calls[0][0], "barStyle");
    expect(["light-content", "dark-content"]).toContain(style);
    const iconColor = style === "light-content" ? "#FFFFFF" : "#000000";
    expect(contrastRatio(iconColor, backgroundColor)).toBeGreaterThanOrEqual(4.5);
    expect(push.mock.calls[0][0]).toMatchObject({ hidden: false });
  },
);

test.each(["container", "scroll"] as const)(
  "%s tracks theme surfaces without remounting its status bar",
  async (kind) => {
    const push = jest.spyOn(StatusBar, "pushStackEntry");
    const replace = jest.spyOn(StatusBar, "replaceStackEntry");
    await render(
      kind === "container" ? (
        <Container><Text>Contenido</Text></Container>
      ) : (
        <ScrollContainer><Text>Contenido</Text></ScrollContainer>
      ),
    );
    expect(push.mock.calls[0][0]).toMatchObject({ barStyle: "dark-content" });
    await act(() => setActiveTheme(DEFAULT_DARK_THEME));
    expect(push).toHaveBeenCalledTimes(1);
    expect(replace.mock.calls.at(-1)?.[1]).toMatchObject({ barStyle: "light-content" });
  },
);

test("container preserves explicit icon and visibility overrides without a top edge", async () => {
  const push = jest.spyOn(StatusBar, "pushStackEntry");
  await render(
    <Container barStyle="light-content" edges={["bottom"]} statusBarHidden>
      <Text>Contenido</Text>
    </Container>,
  );
  expect(push.mock.calls[0][0]).toMatchObject({
    barStyle: "light-content",
    hidden: true,
  });
});

test("container without the top edge leaves status bar ownership to its header", async () => {
  const push = jest.spyOn(StatusBar, "pushStackEntry");
  await render(
    <Container edges={["bottom", "left", "right"]}>
      <AppBar background={{ colors: ["#0C4A6E", "#0EA5E9"] }} title="Eventos" />
    </Container>,
  );
  expect(push).toHaveBeenCalledTimes(1);
  expect(push.mock.calls[0][0]).toMatchObject({ barStyle: "light-content" });
});

test("embedded headers do not change the host status bar", async () => {
  const push = jest.spyOn(StatusBar, "pushStackEntry");
  await render(<AppBar safeArea={false} title="Eventos" />);
  expect(push).not.toHaveBeenCalled();
});

test.each([
  { colors: ["#FFFFFF", "#EEEEEE"] as const, expected: "dark-content" },
  { colors: ["#000000", "#333333"] as const, expected: "light-content" },
])("auth gradient uses its actual top stop: $expected", async ({ colors, expected }) => {
  const push = jest.spyOn(StatusBar, "pushStackEntry");
  await render(
    <AuthContainer background={{ colors }} header={<Text>Logo</Text>}>
      <Text>Formulario</Text>
    </AuthContainer>,
  );
  expect(push.mock.calls[0][0]).toMatchObject({ barStyle: expected });
});

test("gradient headers keep explicit status bar overrides", async () => {
  const push = jest.spyOn(StatusBar, "pushStackEntry");
  await render(
    <AppBar
      background={{ colors: ["#000000", "#FFFFFF"] }}
      barStyle="dark-content"
      title="Eventos"
    />,
  );
  expect(push.mock.calls[0][0]).toMatchObject({ barStyle: "dark-content" });
});
