import { expect, jest, test } from "@jest/globals";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import { toRowItems } from "@sincpro/mobile-ui/views/types/IListView";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { CountRecords: () => null },
}));
jest.mock("@sincpro/mobile-ui/Feedback", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  Feedback: { Empty: () => null, Error: () => null, Loading: () => null },
}));
jest.mock("@sincpro/mobile-ui/Navigation", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const mockReactNative = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Navigation: {
      AppBar: ({ subheader }: { subheader: React.ReactNode }) =>
        mockReact.createElement(mockReactNative.View, null, subheader),
      RowItem: () => null,
      SearchBar: ({
        onChangeText,
        placeholder,
        value,
      }: {
        onChangeText: (value: string) => void;
        placeholder: string;
        value: string;
      }) =>
        mockReact.createElement(mockReactNative.TextInput, {
          onChangeText,
          placeholder,
          value,
        }),
    },
  };
});

test("debounced list search does not repeat when the host callback identity changes", async () => {
  jest.useFakeTimers();
  const firstSearch = jest.fn();
  const nextSearch = jest.fn();
  try {
    const renderList = (onSearch: (query: string) => void) => (
      <ListView.Root
        items={[{ id: "1", name: "Pedido" }]}
        name="Pedidos"
        onSearch={onSearch}
        withContainer={false}
      >
        <ListView.Header>
          <ListView.Header.Search />
        </ListView.Header>
        <ListView.Content>{() => <Text>Pedido</Text>}</ListView.Content>
      </ListView.Root>
    );
    const { rerender } = await render(renderList(firstSearch));
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(firstSearch).toHaveBeenCalledTimes(1);
    expect(firstSearch).toHaveBeenCalledWith("");

    await rerender(renderList(nextSearch));
    expect(nextSearch).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByPlaceholderText("Buscar Pedidos"), "102");
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(firstSearch).toHaveBeenCalledTimes(1);
    expect(nextSearch).toHaveBeenCalledTimes(1);
    expect(nextSearch).toHaveBeenCalledWith("102");
  } finally {
    jest.useRealTimers();
  }
});

test("row mapping preserves zero IDs, empty values, and primitive list indexes", () => {
  expect(toRowItems([{ id: 0, name: "", description: "" }])[0]).toMatchObject({
    id: 0,
    rowTitle: "",
    rowSubtitle: "",
  });
  expect(toRowItems(["Pedido"])[0]).toMatchObject({
    id: "Pedido",
    index: 0,
    rowTitle: "Pedido",
  });
});

test("FlatList keys rows by stable IDs rather than their current position", async () => {
  await render(
    <ListView.Root
      items={[
        { id: 0, name: "Pedido cero" },
        { id: "pedido-2", name: "Pedido dos" },
      ]}
      name="Pedidos"
      withContainer={false}
    >
      <ListView.Content testID="orders-list" />
    </ListView.Root>,
  );

  const list = screen.getByTestId("orders-list");
  const [first, second] = list.props.data;
  expect(list.props.keyExtractor(first)).toBe("0");
  expect(list.props.keyExtractor(second)).toBe("pedido-2");
});
