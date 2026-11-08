import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { processColor, StyleSheet, Text } from "react-native";
import AuthFormView from "@sincpro/mobile-ui/views/AuthFormView";
import FormView from "@sincpro/mobile-ui/views/FormViewV2";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import AppBar from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { BottomInsetContext } from "@sincpro/mobile-ui/layouts/BottomInset";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import { theme } from "@sincpro/mobile-ui/theme";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardStickyView: require("react-native").View,
  KeyboardController: { dismiss: jest.fn() },
  useReanimatedKeyboardAnimation: () => ({
    height: { get: () => 0 },
    progress: { get: () => 0 },
  }),
}));
jest.mock("@sincpro/mobile-ui/Display/Display.Logo", () => () => null);
jest.mock("@sincpro/mobile-ui/index", () => ({
  Display: jest.requireActual<typeof import("@sincpro/mobile-ui/Display")>(
    "@sincpro/mobile-ui/Display",
  ).Display,
  Typography: jest.requireActual<typeof import("@sincpro/mobile-ui/Typography")>(
    "@sincpro/mobile-ui/Typography",
  ).Typography,
}));
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Spinner", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Toast.context", () => ({
  useToast: () => ({}),
}));
jest.mock("@sincpro/mobile-ui/Feedback/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-safe-area-context", () => ({
  ...jest.requireActual<object>("react-native-safe-area-context"),
  SafeAreaView: require("react-native").View,
  useSafeAreaInsets: () => ({ top: 24, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@sincpro/mobile-ui/Form/Form.KeyboardForm", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View } = require("react-native");
  return ({ children, ...props }: { children: React.ReactNode }) =>
    mockReact.createElement(View, { ...props, testID: "template-scroll" }, children);
});
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(async () => {
  await act(async () => jest.runOnlyPendingTimersAsync());
  jest.useRealTimers();
});

test("form template preserves default appearance and merges public keyboard configuration", async () => {
  const { rerender } = await render(
    <BottomInsetContext.Provider value={72}>
      <FormView.Root item={{ id: 1 }} name="Registro" withContainer={false}>
        <FormView.Content>
          <Text>Contenido original</Text>
        </FormView.Content>
      </FormView.Root>
    </BottomInsetContext.Provider>,
  );
  expect(
    StyleSheet.flatten(screen.getByTestId("template-scroll").props.contentContainerStyle),
  ).toMatchObject({ paddingBottom: 72, flexGrow: 1 });
  await rerender(
    <BottomInsetContext.Provider value={72}>
      <FormView.Root item={{ id: 1 }} name="Registro" withContainer={false}>
        <FormView.Content
          keyboardFormProps={{
            bottomOffset: 96,
            contentContainerStyle: { paddingTop: 12 },
            bounces: false,
          }}
        >
          <Text>Contenido original</Text>
        </FormView.Content>
      </FormView.Root>
    </BottomInsetContext.Provider>,
  );
  const scroll = screen.getByTestId("template-scroll");
  expect(scroll.props).toMatchObject({ bottomOffset: 96, bounces: false });
  expect(StyleSheet.flatten(scroll.props.contentContainerStyle)).toMatchObject({
    paddingBottom: 72,
    paddingTop: 12,
    flexGrow: 1,
  });
});

test("auth template keeps its original defaults and forwards keyboard configuration", async () => {
  const { rerender } = await render(
    <AuthFormView FormNode={<Text>Campos</Text>} title="Ingresar" />,
  );
  expect(screen.getByTestId("template-scroll").props).toMatchObject({ bounces: false });
  expect(screen.getByTestId("template-scroll").props.bottomOffset).toBeUndefined();
  await rerender(
    <AuthFormView
      FormNode={<Text>Campos</Text>}
      keyboardFormProps={{ bottomOffset: 88 }}
      title="Ingresar"
    />,
  );
  expect(screen.getByTestId("template-scroll").props).toMatchObject({ bottomOffset: 88 });
});

test("auth header uses available layout height and a branded surface with explicit overrides", async () => {
  const content = (
    <AuthContainer header={<Text>Logo</Text>}>
      <Text>Formulario</Text>
    </AuthContainer>
  );
  const { rerender } = await render(content);
  const gradientColors = () =>
    screen.root?.queryAll((node) => node.props.colors !== undefined)[0]?.props.colors;
  expect(gradientColors()).toEqual(theme.gradient.primary.map(processColor));
  const header = screen.getByText("Logo").parent;
  expect(StyleSheet.flatten(header?.props.style)).toMatchObject({ height: "30%" });
  const card = screen.getByTestId("template-scroll").parent;
  expect(card?.props.className).toContain("flex-1");
  expect(StyleSheet.flatten(card?.props.style)?.minHeight).toBeUndefined();
  await rerender(
    <AuthContainer background={{ surface: "warm" }} header={<Text>Logo</Text>}>
      <Text>Formulario</Text>
    </AuthContainer>,
  );
  expect(gradientColors()).toEqual(["#1A1714", "#C89B3C", "#B88A2E"].map(processColor));
});

test.each(["list", "form"] as const)(
  "%s header reserves the top inset unless its host explicitly handles it",
  async (kind) => {
    const renderHeader = (safeArea?: boolean) =>
      kind === "list" ? (
        <ListView.Root items={[]} name="Registros" withContainer={false}>
          <ListView.Header safeArea={safeArea} />
        </ListView.Root>
      ) : (
        <FormView.Root item={{ id: 1 }} name="Registro" withContainer={false}>
          <FormView.Header safeArea={safeArea} />
        </FormView.Root>
      );
    const { rerender } = await render(renderHeader());
    const insetViews = () =>
      screen.root?.queryAll(
        (node) => StyleSheet.flatten(node.props.style)?.paddingTop === 24,
      );
    expect(insetViews()).toHaveLength(1);
    await rerender(renderHeader(false));
    expect(insetViews()).toHaveLength(0);
  },
);

test("branded app bar reserves one top inset inside its surface", async () => {
  const { rerender } = await render(
    <AppBar background={{ surface: "brand" }} title="Tickets" />,
  );
  const viewsWithTopPadding = (paddingTop: number) =>
    screen.root?.queryAll(
      (node) => StyleSheet.flatten(node.props.style)?.paddingTop === paddingTop,
      { includeSelf: true },
    );
  expect(viewsWithTopPadding(24)).toHaveLength(1);
  await rerender(
    <AppBar background={{ surface: "brand" }} safeArea={false} title="Tickets" />,
  );
  expect(viewsWithTopPadding(24)).toHaveLength(0);
});

test.each(["populated", "empty", "error"] as const)(
  "list template exposes the same keyboard policy in its %s state",
  async (state) => {
    const items = state === "populated" ? [{ id: 1 }] : [];
    const { rerender } = await render(
      <ListView.Root
        hasError={state === "error"}
        items={items}
        name="Registros"
        withContainer={false}
      >
        <ListView.Content testID="list-scroll">
          {() => <Text>Registro</Text>}
        </ListView.Content>
      </ListView.Root>,
    );

    const scroll = () => screen.getByTestId("list-scroll");
    expect(scroll().props).toMatchObject({
      keyboardShouldPersistTaps: "handled",
      keyboardDismissMode: "none",
    });
    await rerender(
      <ListView.Root
        hasError={state === "error"}
        items={items}
        name="Registros"
        withContainer={false}
      >
        <ListView.Content
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          testID="list-scroll"
        >
          {() => <Text>Registro</Text>}
        </ListView.Content>
      </ListView.Root>,
    );
    expect(scroll().props).toMatchObject({
      keyboardShouldPersistTaps: "never",
      keyboardDismissMode: "on-drag",
    });
  },
);

test("default list row activates the host callback without changing the original item", async () => {
  const press = jest.fn();
  const item = { id: 1, name: "Registro original" };
  await render(
    <ListView.Root items={[item]} name="Registros" onPressItem={press} withContainer={false}>
      <ListView.Content />
    </ListView.Root>,
  );
  await fireEvent.press(screen.getByText("Registro original"));
  expect(press).toHaveBeenCalledTimes(1);
  expect(press.mock.calls[0][0]).toBe(item);
  expect(item).toEqual({ id: 1, name: "Registro original" });
});

test("form content reserves measured sticky footer and clears it when hidden or removed", async () => {
  const content = (loading: boolean, footer: boolean) => (
    <FormView.Root isLoading={loading} item={{ id: 1 }} name="Registro" withContainer={false}>
      <FormView.Content>
        <Text>Último campo</Text>
      </FormView.Content>
      {footer ? (
        <FormView.Footer>
          <Text>Guardar cambios</Text>
        </FormView.Footer>
      ) : null}
    </FormView.Root>
  );
  const { rerender } = await render(content(false, true));
  const footer = screen.root?.queryAll((node) =>
    node.props.className?.includes("bg-bg-card px-4 py-3"),
  )[0];
  if (!footer) throw new Error("Missing sticky footer layout");
  await fireEvent(footer, "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 64 } },
  });
  expect(screen.getByTestId("template-scroll").props.stickyFooterHeight).toBe(64);
  await rerender(content(true, true));
  expect(screen.getByTestId("template-scroll").props.stickyFooterHeight).toBe(0);
  await rerender(content(false, false));
  expect(screen.getByTestId("template-scroll").props.stickyFooterHeight).toBe(0);
});
