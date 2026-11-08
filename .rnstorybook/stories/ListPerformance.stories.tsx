import { Actions } from "@sincpro/mobile-ui/Actions";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import ListView, { type ListViewHandle } from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useMemo, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

const meta: Meta = {
  title: "Patterns/Collections/Large List",
  parameters: { layout: "fullscreen", ownsScroll: true, ownsTopInset: true },
};
export default meta;
type Story = StoryObj;

const ITEMS = Array.from({ length: 2000 }, (_, index) => ({
  id: `record-${index}`,
  name: `Registro ${index + 1}`,
}));

export const VirtualizedSelection: Story = {
  render: function VirtualizedSelection() {
    const [selected, setSelected] = useState("");
    const { fontScale } = useWindowDimensions();
    const rowHeight = Math.max(64, Math.ceil(48 * fontScale));
    const tuning = useMemo(
      () => ({
        extraData: selected,
        drawDistance: 500,
      }),
      [selected],
    );
    return (
      <ListView.Root items={ITEMS} name="Registros" withContainer={false}>
        <ListView.Header variant="default">
          <Typography.Text accessibilityLiveRegion="polite">
            {selected ? `Seleccionado: ${selected}` : "2000 registros con reciclado nativo"}
          </Typography.Text>
        </ListView.Header>
        <ListView.Content<(typeof ITEMS)[number]>
          testID="large-record-list"
          tuning={tuning}
          withMargin={false}
        >
          {(item, row) => (
            <Pressable
              accessibilityLabel={row.rowTitle}
              accessibilityState={{ selected: selected === item.id }}
              className="border-b border-border-light px-4 justify-center"
              hitSlop={0}
              onPress={() => setSelected(item.id)}
              style={{ minHeight: rowHeight, paddingVertical: 8 }}
            >
              <Typography.Text>{row.rowTitle}</Typography.Text>
              <Typography.Text variant="caption">
                {selected === item.id ? "Seleccionado" : "Toca para seleccionar"}
              </Typography.Text>
            </Pressable>
          )}
        </ListView.Content>
      </ListView.Root>
    );
  },
};

/** `ListViewHandle`: jump to a row far below the viewport and back to the top. */
export const JumpToRow: Story = {
  render: function JumpToRow() {
    const list = useRef<ListViewHandle>(null);
    return (
      <ListView.Root items={ITEMS} name="Registros" withContainer={false}>
        <ListView.Header variant="default">
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Actions.Button
              onPress={() => list.current?.scrollToIndex(999, { position: "center" })}
              title="Ir al 1000"
              variant="secondary"
            />
            <Actions.Button
              onPress={() => list.current?.scrollToTop()}
              title="Arriba"
              variant="secondary"
            />
          </View>
        </ListView.Header>
        <ListView.Content ref={list} testID="jump-record-list" />
      </ListView.Root>
    );
  },
};

export const TerminalPagination: Story = {
  render: function TerminalPagination() {
    const [count, setCount] = useState(20);
    const items = useMemo(() => ITEMS.slice(0, count), [count]);
    return (
      <ListView.Root
        hasMore={count < 60}
        items={items}
        name="Carga por páginas"
        onLoadMore={() => setCount((value) => Math.min(60, value + 20))}
        withContainer={false}
      >
        <ListView.Header variant="default">
          <Typography.Text>
            {count < 60 ? "Desplázate para cargar otra página local" : "Fin de la colección"}
          </Typography.Text>
          <Actions.Button
            onPress={() => setCount(20)}
            title="Reiniciar demo"
            variant="secondary"
          />
        </ListView.Header>
        <ListView.Content />
      </ListView.Root>
    );
  },
};
