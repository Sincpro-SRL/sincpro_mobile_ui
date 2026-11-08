import "@shopify/flash-list/jestSetup";

import { expect, jest, test } from "@jest/globals";
import type {
  FlashListProps,
  FlashListRef,
  ListRenderItemInfo,
  RenderTarget,
  ViewToken,
} from "@shopify/flash-list";
import { BottomInsetContext } from "@sincpro/mobile-ui/layouts/BottomInset";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import ListView, {
  type ListViewHandle,
  type ListViewVisibleRow,
} from "@sincpro/mobile-ui/views/ListViewV2";
import { ListViewProvider, useListView } from "@sincpro/mobile-ui/views/ListViewV2.context";
import {
  type IRowItem,
  type IRowItemProps,
  toRowItem,
  toRowItems,
} from "@sincpro/mobile-ui/views/types/IListView";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { createRef, memo, type RefObject } from "react";
import { StyleSheet, Text } from "react-native";

// The real FlashList keeps virtualizing; the spy only records the props the DS hands it.
type EngineProps<T> = FlashListProps<T> & { ref?: RefObject<FlashListRef<T> | null> };
const mockEngine: { props?: EngineProps<unknown> } = {};
jest.mock("@shopify/flash-list", () => {
  const actual = jest.requireActual<typeof import("@shopify/flash-list")>("@shopify/flash-list");
  const mockReact = jest.requireActual<typeof import("react")>("react");
  return {
    ...actual,
    FlashList: (props: EngineProps<unknown>) => {
      mockEngine.props = props;
      return mockReact.createElement(actual.FlashList, props);
    },
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Display", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Display: {
      CountRecords: ({ count, name }: { count: number; name: string }) =>
        mockReact.createElement(Text, { testID: "record-count" }, `${name}: ${count}`),
    },
  };
});
jest.mock("@sincpro/mobile-ui/Feedback", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
    Feedback: {
      Empty: () => mockReact.createElement(Text, null, "No records"),
      Error: ({ message }: { message?: string }) =>
        mockReact.createElement(Text, null, message ?? "List error"),
      Loading: ({ message }: { message?: string }) =>
        mockReact.createElement(Text, null, message),
      Spinner: () => mockReact.createElement(View, { testID: "loading-more" }),
    },
  };
});
jest.mock("@sincpro/mobile-ui/Navigation", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const mockReactNative = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Navigation: {
      AppBar: jest.fn(
        ({
          subheader,
          title,
        }: {
          subheader?: React.ReactNode;
          title: string;
          safeArea?: boolean;
        }) =>
          mockReact.createElement(
            mockReactNative.View,
            null,
            mockReact.createElement(
              mockReactNative.Text,
              { accessibilityRole: "header" },
              title,
            ),
            subheader,
          ),
      ),
      RowItem: ({ item, onPress, onDelete, readonly }: IRowItemProps<unknown>) =>
        mockReact.createElement(
          mockReactNative.View,
          null,
          mockReact.createElement(
            mockReactNative.TouchableOpacity,
            {
              accessibilityRole: "button",
              accessibilityLabel: `Open ${item.id}`,
              disabled: readonly,
              onPress,
            },
            mockReact.createElement(mockReactNative.Text, null, item.rowTitle),
          ),
          mockReact.createElement(mockReactNative.TouchableOpacity, {
            accessibilityRole: "button",
            accessibilityLabel: `Delete ${item.id}`,
            disabled: readonly,
            onPress: onDelete,
          }),
        ),
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

function engineProps<T>() {
  if (!mockEngine.props) {
    throw new Error("FlashList did not mount");
  }
  return mockEngine.props as EngineProps<IRowItem<T>>;
}

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
  Object.freeze(event);
  const renderRow = jest.fn((item: Event, row: IRowItem<Event>) => (
    <Text>{`${row.index}: ${item.asJSON()}`}</Text>
  ));
  const onPress = jest.fn();
  const onDelete = jest.fn();
  const { rerender } = await render(
    <ListView.Root items={[event]} name="Eventos" withContainer={false}>
      <ListView.Content<Event>>{renderRow}</ListView.Content>
    </ListView.Root>,
  );
  expect(screen.getByText('0: {"label":"Pedido creado"}')).toBeTruthy();
  expect(renderRow.mock.calls[0][0]).toBe(event);
  expect(renderRow.mock.calls[0][1].item).toBe(event);
  const props = engineProps<Event>();
  const row = props.data?.[0];
  if (!row || !props.renderItem) {
    throw new Error("FlashList row renderer is missing");
  }
  const targets: RenderTarget[] = ["Cell", "Measurement", "StickyHeader"];
  for (const target of targets) {
    const info: ListRenderItemInfo<IRowItem<Event>> = {
      item: row,
      index: 0,
      target,
      extraData: "selected-event",
    };
    props.renderItem(info);
    expect(renderRow).toHaveBeenLastCalledWith(event, row);
  }

  await rerender(
    <ListView.Root
      items={[event]}
      name="Eventos"
      onDeleteItem={onDelete}
      onPressItem={onPress}
      withContainer={false}
    >
      <ListView.Content<Event> testID="original-rows" />
    </ListView.Root>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Open event-1" }));
  await fireEvent.press(screen.getByRole("button", { name: "Delete event-1" }));
  expect(onPress.mock.calls[0][0]).toBe(event);
  expect(onDelete.mock.calls[0][0]).toBe(event);
  expect(Object.hasOwn(event, "index")).toBe(false);
});

test("FlashList keys original rows by stable IDs when their positions change", async () => {
  const items = [
    { id: 0, name: "Pedido cero" },
    { id: "pedido-2", name: "Pedido dos" },
  ];
  type Order = (typeof items)[number];
  const list = (rows: typeof items) => (
    <ListView.Root items={rows} name="Pedidos" withContainer={false}>
      <ListView.Content testID="orders-list" />
    </ListView.Root>
  );
  const { rerender } = await render(list(items));
  const props = engineProps<Order>();
  const [first, second] = props.data ?? [];
  expect(props.keyExtractor?.(first, 0)).toBe("0");
  expect(props.keyExtractor?.(second, 1)).toBe("pedido-2");
  expect(first.item).toBe(items[0]);
  expect(second.item).toBe(items[1]);

  await rerender(list([items[1], items[0]]));
  const reordered = engineProps<Order>();
  const [movedSecond, movedFirst] = reordered.data ?? [];
  expect(reordered.keyExtractor?.(movedSecond, 0)).toBe("pedido-2");
  expect(reordered.keyExtractor?.(movedFirst, 1)).toBe("0");
  expect(movedSecond.item).toBe(items[1]);
  expect(movedFirst.item).toBe(items[0]);
});

test("tuning reaches the engine in DS terms and hands back original items", async () => {
  type Order = { id: string; name: string };
  const items = [{ id: "1", name: "Pedido" }];
  const rowType = jest.fn((order: Order, _index: number) => order.name);
  const onVisibleRowsChange = jest.fn<(rows: ListViewVisibleRow<Order>[]) => void>();
  const list = (extraData: string, keepVisiblePosition = false) => (
    <ListView.Root items={items} name="Pedidos" withContainer={false}>
      <ListView.Content<Order>
        contentContainerStyle={{ paddingTop: 12 }}
        testID="tuned-list"
        tuning={{
          drawDistance: 300,
          extraData,
          initialIndex: 0,
          keepVisiblePosition,
          loadMoreThreshold: 0.25,
          onVisibleRowsChange,
          rowType,
          visiblePercent: 50,
        }}
      />
    </ListView.Root>
  );
  const { rerender } = await render(list("selection-1"));
  const props = engineProps<Order>();
  expect(props).toMatchObject({
    drawDistance: 300,
    extraData: "selection-1",
    initialScrollIndex: 0,
    onEndReachedThreshold: 0.25,
    maintainVisibleContentPosition: { disabled: true },
    viewabilityConfig: { itemVisiblePercentThreshold: 50 },
  });
  expect(StyleSheet.flatten(props.contentContainerStyle)?.paddingTop).toBe(12);

  const row = props.data?.[0];
  if (!row) {
    throw new Error("FlashList row is missing");
  }
  expect(props.getItemType?.(row, 0)).toBe("Pedido");
  expect(rowType).toHaveBeenLastCalledWith(items[0], 0);

  const visible: ViewToken<IRowItem<Order>> = {
    item: row,
    key: "1",
    index: 0,
    isViewable: true,
    timestamp: 123,
  };
  const unplaced: ViewToken<IRowItem<Order>> = { ...visible, index: null };
  props.onViewableItemsChanged?.({ viewableItems: [visible, unplaced], changed: [visible] });
  expect(onVisibleRowsChange).toHaveBeenLastCalledWith([{ item: items[0], index: 0 }]);
  expect(onVisibleRowsChange.mock.calls.at(-1)?.[0][0].item).toBe(items[0]);

  await rerender(list("selection-2", true));
  expect(engineProps<Order>().extraData).toBe("selection-2");
  expect(engineProps<Order>().maintainVisibleContentPosition).toBeUndefined();
});

test("an untuned list keeps the defaults and skips viewability work", async () => {
  await render(
    <ListView.Root items={[{ id: "1", name: "Pedido" }]} name="Pedidos" withContainer={false}>
      <ListView.Content testID="plain-list" />
    </ListView.Root>,
  );
  const props = engineProps();
  expect(props.onEndReachedThreshold).toBe(0.5);
  expect(props.maintainVisibleContentPosition).toEqual({ disabled: true });
  expect(props.onViewableItemsChanged).toBeUndefined();
  expect(props.viewabilityConfig).toBeUndefined();
  expect(props.getItemType).toBeUndefined();
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
    onLoadMore.mockClear();
    await act(() => engineProps().onEndReached?.());
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
  onLoadMore.mockClear();
  await act(() => {
    engineProps().refreshControl?.props.onRefresh?.();
  });
  expect(engineProps().refreshControl?.props.refreshing).toBe(true);
  await act(() => engineProps().onEndReached?.());
  expect(onLoadMore).not.toHaveBeenCalled();
  await act(() => finishRefresh());
  expect(engineProps().refreshControl?.props.refreshing).toBe(false);
  await act(() => engineProps().onEndReached?.());
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

test("ListViewHandle drives the engine and ignores calls without a list", async () => {
  const handle = createRef<ListViewHandle>();
  const list = (items: { id: string; name: string }[]) => (
    <ListView.Root items={items} name="Pedidos" withContainer={false}>
      <ListView.Content ref={handle} testID="ref-list" />
    </ListView.Root>
  );
  const { rerender } = await render(list([]));
  expect(screen.getByText("No records")).toBeTruthy();
  await handle.current?.scrollToIndex(0);
  handle.current?.scrollToTop();
  handle.current?.scrollToEnd();

  await rerender(list([{ id: "1", name: "Pedido" }, { id: "2", name: "Pedido 2" }]));
  const engine = engineProps().ref?.current;
  if (!engine) {
    throw new Error("FlashList ref is missing");
  }
  const scrollToIndex = jest.spyOn(engine, "scrollToIndex").mockResolvedValue();
  const scrollToTop = jest.spyOn(engine, "scrollToTop").mockReturnValue();
  const scrollToEnd = jest.spyOn(engine, "scrollToEnd").mockReturnValue();

  await handle.current?.scrollToIndex(1, { position: "center" });
  await handle.current?.scrollToIndex(2);
  await handle.current?.scrollToIndex(-1);
  handle.current?.scrollToTop({ animated: false });
  handle.current?.scrollToEnd();

  expect(scrollToIndex).toHaveBeenCalledTimes(1);
  expect(scrollToIndex).toHaveBeenCalledWith({ index: 1, animated: true, viewPosition: 0.5 });
  expect(scrollToTop).toHaveBeenCalledWith({ animated: false });
  expect(scrollToEnd).toHaveBeenCalledWith({ animated: true });
});

test("a growing immutable list only mounts the real FlashList viewport", async () => {
  const items = Object.freeze(
    Array.from({ length: 1000 }, (_, id) => ({ id, name: `Pedido ${id}` })),
  );
  const renderRow = jest.fn((item: (typeof items)[number]) => <Text>{item.name}</Text>);
  await render(
    <ListView.Root items={items} name="Pedidos" withContainer={false}>
      <ListView.Content tuning={{ drawDistance: 100 }}>{renderRow}</ListView.Content>
    </ListView.Root>,
  );
  expect(screen.getByText("Pedido 0")).toBeTruthy();
  expect(screen.queryByText("Pedido 999")).toBeNull();
  expect(renderRow.mock.calls.length).toBeLessThan(items.length);
  expect(screen.getByTestId("record-count").props.children).toBe("Pedidos: 1000");
});

test.each([false, true])(
  "row and collection readonly state is retained: root=%s",
  async (readonly) => {
    const onPress = jest.fn();
    const onDelete = jest.fn();
    const items = [
      { id: "locked", name: "Bloqueado", readonly: true },
      { id: "editable", name: "Editable", readonly: false },
    ];
    await render(
      <ListView.Root
        items={items}
        name="Pedidos"
        onDeleteItem={onDelete}
        onPressItem={onPress}
        readonly={readonly}
        withContainer={false}
      >
        <ListView.Content />
      </ListView.Root>,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Open locked" }));
    await fireEvent.press(screen.getByRole("button", { name: "Delete locked" }));
    expect(onPress).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Open editable" }));
    await fireEvent.press(screen.getByRole("button", { name: "Delete editable" }));
    expect(onPress).toHaveBeenCalledTimes(readonly ? 0 : 1);
    expect(onDelete).toHaveBeenCalledTimes(readonly ? 0 : 1);
    if (!readonly) {
      expect(onPress).toHaveBeenCalledWith(items[1]);
      expect(onDelete).toHaveBeenCalledWith(items[1]);
    }
  },
);

test("headers own top while the list container defaults to lateral edges only", async () => {
  const list = (edges?: ("top" | "bottom" | "left" | "right")[], safeArea = true) => (
    <ListView.Root edges={edges} items={[]} name="Pedidos">
      <ListView.Header safeArea={safeArea} />
    </ListView.Root>
  );
  const { rerender } = await render(list());
  expect(screen.root?.props.edges).toEqual({
    left: "additive",
    right: "additive",
    top: "off",
    bottom: "off",
  });
  expect(jest.mocked(Navigation.AppBar).mock.calls.at(-1)?.[0].safeArea).toBe(true);
  await rerender(list(["top", "bottom", "left", "right"], false));
  expect(screen.root?.props.edges).toEqual({
    top: "additive",
    bottom: "additive",
    left: "additive",
    right: "additive",
  });
  expect(jest.mocked(Navigation.AppBar).mock.calls.at(-1)?.[0].safeArea).toBe(false);
});

test("list padding only adds the host's explicit floating bottom inset", async () => {
  await render(
    <BottomInsetContext.Provider value={48}>
      <ListView.Root items={[{ id: "1", name: "Pedido" }]} name="Pedidos">
        <ListView.Content contentContainerStyle={{ paddingTop: 12 }} />
      </ListView.Root>
    </BottomInsetContext.Provider>,
  );
  expect(screen.root?.props.edges).toMatchObject({ top: "off", bottom: "off" });
  expect(StyleSheet.flatten(engineProps().contentContainerStyle)).toMatchObject({
    paddingTop: 12,
    paddingBottom: 48,
  });
});

test("loading, empty state, list chrome and both footers survive the engine migration", async () => {
  const list = (items: { id: string; name: string }[], isLoading = false) => (
    <ListView.Root
      isLoading={isLoading}
      items={items}
      loadingMore
      name="Pedidos"
      withContainer={false}
    >
      <ListView.Header />
      <ListView.Content />
      <ListView.Footer>
        <Text>Acciones fijas</Text>
      </ListView.Footer>
    </ListView.Root>
  );
  const { rerender } = await render(list([], true));
  expect(screen.getByText("Cargando Pedidos...")).toBeTruthy();
  expect(screen.getByRole("header", { name: "Pedidos" })).toBeTruthy();
  expect(screen.queryByText("Acciones fijas")).toBeNull();
  await rerender(list([]));
  expect(screen.getByText("No records")).toBeTruthy();
  expect(screen.queryByText("Acciones fijas")).toBeNull();
  await rerender(list([{ id: "1", name: "Pedido" }]));
  expect(screen.getByTestId("record-count").props.children).toBe("Pedidos: 1");
  expect(screen.getByTestId("loading-more")).toBeTruthy();
  expect(screen.getByText("Acciones fijas")).toBeTruthy();
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
