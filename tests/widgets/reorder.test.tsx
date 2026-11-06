import { expect, jest, test } from "@jest/globals";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import ReorderableList, {
  type ReorderableListProps,
} from "@sincpro/mobile-ui/widgets/ReorderableList";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, StyleSheet, Text, View } from "react-native";

jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("react-native-sortables", () => {
  const mockReact = jest.requireActual<typeof import("react")>("react");
  const { View: MockView } =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    __esModule: true,
    default: {
      Grid: ({
        data,
        renderItem,
        keyExtractor,
        ...props
      }: {
        data: Item[];
        renderItem: (context: { item: Item; index: number }) => import("react").ReactNode;
        keyExtractor: (item: Item) => string;
      }) =>
        mockReact.createElement(
          MockView,
          { ...props, testID: "sortable-engine" },
          data.map((item, index) =>
            mockReact.createElement(
              mockReact.Fragment,
              { key: keyExtractor(item) },
              renderItem({ item, index }),
            ),
          ),
        ),
      Handle: ({ children, ...props }: { children: import("react").ReactNode }) =>
        mockReact.createElement(MockView, props, children),
    },
  };
});

const items = [
  { id: "a", title: "Entrada" },
  { id: "b", title: "Revisión" },
  { id: "c", title: "Completados" },
];
type Item = (typeof items)[number];
const props = {
  items,
  keyExtractor: (item: Item) => item.id,
  getItemLabel: (item: Item) => item.title,
  renderItem: ({ item }: { item: Item }) => <Text>{item.title}</Text>,
  testID: "reorder",
} satisfies Omit<ReorderableListProps<Item>, "onChange">;

test("buttons propose immutable controlled order with disabled boundaries and targets", async () => {
  const change = jest.fn();
  await render(<ReorderableList {...props} onChange={change} />);
  expect(
    screen.getByRole("button", { name: "Subir Entrada" }).props.accessibilityState.disabled,
  ).toBe(true);
  expect(
    screen.getByRole("button", { name: "Bajar Completados" }).props.accessibilityState
      .disabled,
  ).toBe(true);
  expect(
    StyleSheet.flatten(screen.getByRole("button", { name: "Bajar Entrada" }).props.style),
  ).toMatchObject({ minHeight: 48, minWidth: 48 });
  await fireEvent.press(screen.getByRole("button", { name: "Bajar Entrada" }));
  expect(change).toHaveBeenCalledWith([items[1], items[0], items[2]], {
    key: "a",
    fromIndex: 0,
    toIndex: 1,
    source: "button",
  });
  expect(items.map((item) => item.id)).toEqual(["a", "b", "c"]);
  expect(screen.getByTestId("reorder-handle-a").props.accessibilityValue.now).toBe(1);
});

test("drag uses stable identity and final insertion index; no-op does not emit a change", async () => {
  const change = jest.fn();
  const start = jest.fn();
  const end = jest.fn();
  await render(
    <ReorderableList {...props} onChange={change} onDragStart={start} onDragEnd={end} />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", {
    key: ".$a",
    fromIndex: 0,
  });
  expect(start).toHaveBeenCalledWith("a");
  expect(
    screen.getByRole("button", { name: "Bajar Entrada" }).props.accessibilityState.disabled,
  ).toBe(true);
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    key: ".$a",
    fromIndex: 0,
    toIndex: 2,
  });
  expect(change).toHaveBeenCalledWith([items[1], items[2], items[0]], {
    key: "a",
    fromIndex: 0,
    toIndex: 2,
    source: "drag",
  });
  expect(end).toHaveBeenCalledTimes(1);
  change.mockClear();
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", { fromIndex: 0 });
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    fromIndex: 0,
    toIndex: 0,
  });
  expect(change).not.toHaveBeenCalled();
});

test("native adjustable actions use the same move contract and localization", async () => {
  const change = jest.fn();
  const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
  await render(
    <ReorderableList
      {...props}
      onChange={change}
      labels={{
        drag: (label) => `Move ${label}`,
        up: (label) => `Earlier ${label}`,
        down: (label) => `Later ${label}`,
        moved: (label, position) => `${label} at ${position}`,
      }}
    />,
  );
  const handle = screen.getByRole("adjustable", { name: "Move Revisión" });
  expect(handle.props.accessibilityActions).toEqual([
    { name: "decrement" },
    { name: "increment" },
  ]);
  await fireEvent(handle, "accessibilityAction", {
    nativeEvent: { actionName: "decrement" },
  });
  expect(change).toHaveBeenCalledWith(
    [items[1], items[0], items[2]],
    expect.objectContaining({ source: "button" }),
  );
  expect(announce).toHaveBeenCalledWith("Revisión at 1");
  announce.mockRestore();
});

test("external insert/reorder during drag is rejected visibly, never overwriting newer data", async () => {
  const change = jest.fn();
  const reject = jest.fn();
  const { rerender } = await render(
    <ReorderableList {...props} onChange={change} onReorderRejected={reject} />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", { fromIndex: 0 });
  await rerender(
    <ReorderableList
      {...props}
      items={[...items, { id: "d", title: "Nuevo" }]}
      onChange={change}
      onReorderRejected={reject}
    />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    fromIndex: 0,
    toIndex: 2,
  });
  expect(change).not.toHaveBeenCalled();
  expect(reject).toHaveBeenCalledWith("data-changed");
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(screen.getByText("Nuevo")).toBeTruthy();
});

test("content updates with unchanged identities are preserved on drop", async () => {
  const change = jest.fn();
  const { rerender } = await render(<ReorderableList {...props} onChange={change} />);
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", { fromIndex: 0 });
  const updated = { id: "a", title: "Entrada actualizada" };
  await rerender(
    <ReorderableList {...props} items={[updated, items[1], items[2]]} onChange={change} />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    fromIndex: 0,
    toIndex: 2,
  });
  expect(change.mock.calls[0][0]).toEqual([items[1], items[2], updated]);
});

test("removing the dragged item cancels immediately and leaves remaining controls usable", async () => {
  const change = jest.fn();
  const reject = jest.fn();
  const end = jest.fn();
  const { rerender } = await render(
    <ReorderableList
      {...props}
      onChange={change}
      onReorderRejected={reject}
      onDragEnd={end}
    />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", { fromIndex: 0 });
  await rerender(
    <ReorderableList
      {...props}
      items={items.slice(1)}
      onChange={change}
      onReorderRejected={reject}
      onDragEnd={end}
    />,
  );
  expect(screen.queryByTestId("reorder-item-a")).toBeNull();
  expect(reject).toHaveBeenCalledWith("data-changed");
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Bajar Revisión" }).props.accessibilityState.disabled,
  ).toBe(false);
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    fromIndex: 0,
    toIndex: 1,
  });
  expect(change).not.toHaveBeenCalled();
  expect(end).toHaveBeenCalledTimes(1);
  await fireEvent.press(screen.getByRole("button", { name: "Bajar Revisión" }));
  expect(change).toHaveBeenCalledWith(
    [items[2], items[1]],
    expect.objectContaining({ source: "button" }),
  );
});

test("disabling a list prevents buttons and rejects an in-progress drop", async () => {
  const change = jest.fn();
  const reject = jest.fn();
  const { rerender } = await render(
    <ReorderableList {...props} onChange={change} onReorderRejected={reject} />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragStart", { fromIndex: 0 });
  await rerender(
    <ReorderableList {...props} disabled onChange={change} onReorderRejected={reject} />,
  );
  await fireEvent(screen.getByTestId("sortable-engine"), "dragEnd", {
    fromIndex: 0,
    toIndex: 1,
  });
  expect(reject).toHaveBeenCalledWith("disabled");
  await fireEvent.press(screen.getByRole("button", { name: "Bajar Entrada" }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByTestId("sortable-engine").props.sortEnabled).toBe(false);
});

test("custom content, controls, engine settings and native styles remain open", async () => {
  const change = jest.fn();
  await render(
    <ReorderableList
      {...props}
      onChange={change}
      style={{ padding: 3 }}
      itemStyle={{ borderRadius: 18 }}
      handleStyle={{ borderRadius: 24 }}
      renderHandleContent={() => <Text>Handle propio</Text>}
      renderControls={({ dragHandle, moveDown, canMoveDown, item }) => (
        <View>
          {dragHandle}
          <Pressable disabled={!canMoveDown} onPress={moveDown}>
            <Text>{`Después ${item.title}`}</Text>
          </Pressable>
        </View>
      )}
      sortableProps={{ rowGap: 12, dragActivationDelay: 500, activeItemScale: 1.02 }}
    />,
  );
  expect(StyleSheet.flatten(screen.getByTestId("reorder").props.style).padding).toBe(3);
  expect(
    StyleSheet.flatten(screen.getByTestId("reorder-item-a").props.style).borderRadius,
  ).toBe(18);
  expect(
    StyleSheet.flatten(screen.getByTestId("reorder-handle-a").props.style).borderRadius,
  ).toBe(24);
  expect(screen.getAllByText("Handle propio")).toHaveLength(3);
  expect(screen.getByTestId("sortable-engine").props).toMatchObject({
    rowGap: 12,
    dragActivationDelay: 500,
    activeItemScale: 1.02,
    customHandle: true,
    columns: 1,
  });
  await fireEvent.press(screen.getByText("Después Entrada"));
  expect(change).toHaveBeenCalledTimes(1);
});

test("empty lists are valid; duplicate stable keys fail explicitly", async () => {
  const { rerender } = await render(
    <ReorderableList {...props} items={[]} onChange={jest.fn()} />,
  );
  expect(screen.queryAllByRole("adjustable")).toHaveLength(0);
  await expect(
    rerender(
      <ReorderableList {...props} items={[items[0], items[0]]} onChange={jest.fn()} />,
    ),
  ).rejects.toThrow(/unique/);
});
