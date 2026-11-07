import { Actions } from "@sincpro/mobile-ui/Actions";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

const meta: Meta = {
  title: "Patterns/Collections/Large List",
  parameters: { layout: "fullscreen", ownsScroll: true },
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
    const listProps = useMemo(
      () => ({
        extraData: selected,
        initialNumToRender: 12,
        maxToRenderPerBatch: 8,
        windowSize: 7,
        getItemLayout: (_data: unknown, index: number) => ({
          length: rowHeight,
          offset: rowHeight * index,
          index,
        }),
      }),
      [rowHeight, selected],
    );
    return (
      <ListView.Root items={ITEMS} name="Registros" withContainer={false}>
        <ListView.Header variant="default">
          <Typography.Text accessibilityLiveRegion="polite">
            {selected
              ? `Seleccionado: ${selected}`
              : "2000 registros, renderizados por ventana"}
          </Typography.Text>
        </ListView.Header>
        <ListView.Content listProps={listProps} testID="large-record-list" withMargin={false}>
          {(item) => (
            <Pressable
              accessibilityLabel={item.rowTitle}
              accessibilityState={{ selected: selected === item.id }}
              className="border-b border-border-light px-4 justify-center"
              hitSlop={0}
              onPress={() => setSelected(item.id)}
              style={{ height: rowHeight }}
            >
              <Typography.Text>{item.rowTitle}</Typography.Text>
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
