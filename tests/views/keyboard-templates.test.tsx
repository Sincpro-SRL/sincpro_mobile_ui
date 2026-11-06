import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";
import AuthFormView from "@sincpro/mobile-ui/views/AuthFormView";
import FormView from "@sincpro/mobile-ui/views/FormViewV2";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import { BottomInsetContext } from "@sincpro/mobile-ui/layouts/BottomInset";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display/Display.Logo", () => () => null);
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
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
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
  expect(screen.getByTestId("template-scroll").props.toolbar).toBe(false);
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
            keyboardDismissMode: "on-drag",
            toolbarProps: { doneLabel: "Terminar", showDoneLabel: true },
          }}
          keyboardToolbar
        >
          <Text>Contenido original</Text>
        </FormView.Content>
      </FormView.Root>
    </BottomInsetContext.Provider>,
  );
  const scroll = screen.getByTestId("template-scroll");
  expect(scroll.props).toMatchObject({
    toolbar: true,
    bottomOffset: 96,
    keyboardDismissMode: "on-drag",
    toolbarProps: { doneLabel: "Terminar", showDoneLabel: true },
  });
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
  expect(screen.getByTestId("template-scroll").props).toMatchObject({
    toolbar: false,
    bottomOffset: 50,
    bounces: false,
  });
  await rerender(
    <AuthFormView
      FormNode={<Text>Campos</Text>}
      keyboardFormProps={{
        bottomOffset: 88,
        toolbarProps: { doneLabel: "Finalizar" },
      }}
      keyboardToolbar
      title="Ingresar"
    />,
  );
  expect(screen.getByTestId("template-scroll").props).toMatchObject({
    toolbar: true,
    bottomOffset: 88,
    toolbarProps: { doneLabel: "Finalizar" },
  });
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
  expect(press).toHaveBeenCalledWith(expect.objectContaining(item));
  expect(item).toEqual({ id: 1, name: "Registro original" });
});
