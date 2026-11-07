import { expect, jest, test } from "@jest/globals";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import { ListViewProvider, useListView } from "@sincpro/mobile-ui/views/ListViewV2.context";
import {
  type IRowItem,
  toRowItem,
  toRowItems,
} from "@sincpro/mobile-ui/views/types/IListView";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { createRef, memo } from "react";
import type { FlatList } from "react-native";
import { StyleSheet } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display", () => ({
  Display: { CountRecords: () => null },
}));
jest.mock("@sincpro/mobile-ui/Feedback", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  Feedback: {
    Empty: () => null,
    Error: () => null,
    Loading: () => null,
    Spinner: () => null,
  },
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

test("row metadata wraps frozen entities without losing private fields or getters", () => {
  class Event {
    #label = "Pedido creado";
    get id() {
      return "event-1";
    }
    get name() {
      return this.#label;
    }
    asJSON() {
      return JSON.stringify({ label: this.#label });
    }
  }
  const event = Object.freeze(new Event());
  const row = toRowItem(event, 3);
  expect(row.item).toBe(event);
  expect(row.item.asJSON()).toBe('{"label":"Pedido creado"}');
  expect(row).toMatchObject({ id: "event-1", index: 3, rowTitle: "Pedido creado" });
  expect(Object.hasOwn(event, "index")).toBe(false);
  expect(Object.hasOwn(row, "asJSON")).toBe(false);
});

test("custom key mapping keeps metadata separate from domain fields", () => {
  const item = { uuid: "event-2", title: "", subtitle: "Detalle", locked: true, index: 99 };
  const row = toRowItem(item, 2, {
    id: "uuid",
    rowTitle: "title",
    rowSubtitle: "subtitle",
    readOnly: "locked",
  });
  expect(row).toMatchObject({
    item,
    id: "event-2",
    index: 2,
    rowTitle: "",
    rowSubtitle: "Detalle",
    readonly: true,
  });
  expect(item.index).toBe(99);
});

test("unsupported rows and IDs fail explicitly", () => {
  expect(() => toRowItem(null, 0)).toThrow(TypeError);
  expect(() => toRowItem({ id: {} }, 0)).toThrow(TypeError);
});

test("custom renderers and default row actions receive original entities", async () => {
  class Event {
    readonly id = "event-1";
    #label = "Pedido creado";
    get name() {
      return this.#label;
    }
    asJSON() {
      return JSON.stringify({ label: this.#label });
    }
  }
  const event = new Event();
  const renderRow = jest.fn((item: Event, row: IRowItem<unknown>) => (
    <Text>{`${row.index}: ${item.asJSON()}`}</Text>
  ));
  const onPress = jest.fn();
  const onDelete = jest.fn();
  const { rerender } = await render(
    <ListView.Root items={[event]} name="Eventos" withContainer={false}>
      <ListView.Content>{renderRow}</ListView.Content>
    </ListView.Root>,
  );
  expect(screen.getByText('0: {"label":"Pedido creado"}')).toBeTruthy();
  expect(renderRow.mock.calls[0][0]).toBe(event);
  expect(renderRow.mock.calls[0][1].item).toBe(event);

  await rerender(
    <ListView.Root
      items={[event]}
      name="Eventos"
      onDeleteItem={onDelete}
      onPressItem={onPress}
      withContainer={false}
    >
      <ListView.Content testID="original-rows" />
    </ListView.Root>,
  );
  const list = screen.getByTestId("original-rows");
  const row = list.props.renderItem({ item: list.props.data[0] });
  await act(() => {
    row.props.onPress();
    row.props.onDelete();
  });
  expect(onPress.mock.calls[0][0]).toBe(event);
  expect(onDelete.mock.calls[0][0]).toBe(event);
  expect(Object.hasOwn(event, "index")).toBe(false);
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

test("list exposes virtualization, fixed-row geometry, external selection and viewability without replacing its engine", async () => {
  const getItemLayout = (_data: unknown, index: number) => ({
    length: 64,
    offset: 64 * index,
    index,
  });
  const onViewableItemsChanged = jest.fn();
  const items = [{ id: "1", name: "Pedido" }];
  const { rerender } = await render(
    <ListView.Root items={items} name="Pedidos" withContainer={false}>
      <ListView.Content
        contentContainerStyle={{ paddingTop: 12 }}
        listProps={{
          initialNumToRender: 12,
          maxToRenderPerBatch: 8,
          windowSize: 7,
          updateCellsBatchingPeriod: 40,
          removeClippedSubviews: false,
          extraData: "selection-1",
          getItemLayout,
          onViewableItemsChanged,
          onEndReachedThreshold: 0.25,
        }}
        testID="tuned-list"
      />
    </ListView.Root>,
  );
  const list = screen.getByTestId("tuned-list");
  expect(list.props).toMatchObject({
    initialNumToRender: 12,
    maxToRenderPerBatch: 8,
    windowSize: 7,
    updateCellsBatchingPeriod: 40,
    removeClippedSubviews: false,
    extraData: "selection-1",
    onEndReachedThreshold: 0.25,
  });
  expect(list.props.getItemLayout(null, 100)).toEqual({
    length: 64,
    offset: 6400,
    index: 100,
  });
  expect(list.props.onViewableItemsChanged).toBe(onViewableItemsChanged);
  expect(StyleSheet.flatten(list.props.contentContainerStyle).paddingTop).toBe(12);
  await rerender(
    <ListView.Root items={items} name="Pedidos" withContainer={false}>
      <ListView.Content
        listProps={{ extraData: "selection-2", onViewableItemsChanged }}
        testID="tuned-list"
      />
    </ListView.Root>,
  );
  expect(screen.getByTestId("tuned-list").props.extraData).toBe("selection-2");
  expect(screen.getByTestId("tuned-list").props.onEndReachedThreshold).toBe(0.5);
});

test.each([
  { hasMore: true, loadingMore: false, expected: 1 },
  { hasMore: false, loadingMore: false, expected: 0 },
  { hasMore: true, loadingMore: true, expected: 0 },
])(
  "pagination respects terminal and pending state: %j",
  async ({ hasMore, loadingMore, expected }) => {
    const onLoadMore = jest.fn();
    await render(
      <ListView.Root
        hasMore={hasMore}
        items={[{ id: "1", name: "Pedido" }]}
        loadingMore={loadingMore}
        name="Pedidos"
        onLoadMore={onLoadMore}
        withContainer={false}
      >
        <ListView.Content testID="paged-list" />
      </ListView.Root>,
    );
    await act(() => screen.getByTestId("paged-list").props.onEndReached());
    expect(onLoadMore).toHaveBeenCalledTimes(expected);
  },
);

test("pagination is paused while refreshing and resumes after refresh settles", async () => {
  let finishRefresh!: () => void;
  const onRefresh = () =>
    new Promise<void>((resolve) => {
      finishRefresh = resolve;
    });
  const onLoadMore = jest.fn();
  await render(
    <ListView.Root
      items={[{ id: "1", name: "Pedido" }]}
      name="Pedidos"
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
      withContainer={false}
    >
      <ListView.Content testID="refresh-list" />
    </ListView.Root>,
  );
  await act(() => {
    screen.getByTestId("refresh-list").props.refreshControl.props.onRefresh();
  });
  await act(() => screen.getByTestId("refresh-list").props.onEndReached());
  expect(onLoadMore).not.toHaveBeenCalled();
  await act(() => finishRefresh());
  await act(() => screen.getByTestId("refresh-list").props.onEndReached());
  expect(onLoadMore).toHaveBeenCalledTimes(1);
});

test("memoized consumers do not rerender for an unrelated provider parent update", async () => {
  const items = [{ id: "1", name: "Pedido" }];
  const renderConsumer = jest.fn();
  const Consumer = memo(function Consumer() {
    const { name } = useListView();
    renderConsumer();
    return <Text>{name}</Text>;
  });

  const provider = (unrelated: string, name = "Pedidos") => (
    <>
      <Text>{unrelated}</Text>
      <ListViewProvider items={items} name={name}>
        <Consumer />
      </ListViewProvider>
    </>
  );
  const { rerender } = await render(provider("Primero"));
  expect(renderConsumer).toHaveBeenCalledTimes(1);
  await rerender(provider("Segundo"));
  expect(renderConsumer).toHaveBeenCalledTimes(1);
  await rerender(provider("Tercero", "Inventario"));
  expect(renderConsumer).toHaveBeenCalledTimes(2);
});

test("listRef exposes the existing FlatList imperative scroll API", async () => {
  const listRef = createRef<FlatList<IRowItem<unknown>>>();
  await render(
    <ListView.Root items={[{ id: "1", name: "Pedido" }]} name="Pedidos" withContainer={false}>
      <ListView.Content listRef={listRef} testID="ref-list" />
    </ListView.Root>,
  );
  expect(typeof listRef.current?.scrollToIndex).toBe("function");
  expect(typeof listRef.current?.scrollToOffset).toBe("function");
});

test.each([false, true])(
  "content styles also apply to empty/error recovery surfaces: error=%s",
  async (hasError) => {
    await render(
      <ListView.Root hasError={hasError} items={[]} name="Pedidos" withContainer={false}>
        <ListView.Content
          contentContainerStyle={{ paddingTop: 18 }}
          testID="recovery-surface"
        />
      </ListView.Root>,
    );
    expect(
      StyleSheet.flatten(screen.getByTestId("recovery-surface").props.contentContainerStyle),
    ).toMatchObject({ paddingTop: 18, flexGrow: 1 });
  },
);
