import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import ReorderableList from "@sincpro/mobile-ui/widgets/ReorderableList";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

const meta = {
  title: "Patterns/Collections/Reordering",
  parameters: { layout: "fullscreen", ownsScroll: true },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const initialItems: { id: string; title: string; description: string; icon: IconName }[] = [
  {
    id: "inbox",
    title: "Entrada",
    description: "Pendientes del equipo",
    icon: "inbox",
  },
  {
    id: "review",
    title: "Revisión",
    description: "Documentos por revisar",
    icon: "document",
  },
  {
    id: "done",
    title: "Completados",
    description: "Trabajo finalizado",
    icon: "success",
  },
];

function ReorderExample({
  custom = false,
  long = false,
  concurrent = false,
}: {
  custom?: boolean;
  long?: boolean;
  concurrent?: boolean;
}) {
  const theme = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [items, setItems] = useState(initialItems);
  const [disabled, setDisabled] = useState(false);
  const [action, setAction] = useState("Sin acciones");
  const pendingUpdate = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (pendingUpdate.current !== null) clearTimeout(pendingUpdate.current);
    },
    [],
  );
  return (
    <Animated.ScrollView
      contentContainerStyle={{ padding: 16, gap: 16 }}
      keyboardShouldPersistTaps="handled"
      ref={scrollRef}
    >
      <View style={{ gap: 4 }}>
        <Typography.Heading variant="h4">Organizar secciones</Typography.Heading>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          Mantén el handle y arrastra, o utiliza las flechas. El contenido tiene acciones
          independientes.
        </Typography.Text>
      </View>
      <Typography.Text
        accessibilityLiveRegion="polite"
        testID="reorder-order"
        variant="caption"
      >
        Orden: {items.map((item) => item.title).join(", ")}
      </Typography.Text>
      <ReorderableList
        disabled={disabled}
        getItemLabel={(item) => item.title}
        handleStyle={
          custom ? { borderRadius: 24, backgroundColor: theme.bg.accent } : undefined
        }
        items={items}
        itemStyle={{
          backgroundColor: theme.bg.card,
          borderRadius: custom ? 20 : 8,
          padding: 8,
        }}
        keyExtractor={(item) => item.id}
        onChange={(next, event) => {
          setItems(next);
          setAction(`Cambio por ${event.source === "drag" ? "arrastre" : "botón"}`);
        }}
        onDragStart={
          concurrent
            ? () => {
                pendingUpdate.current = setTimeout(() => {
                  setItems((current) => [
                    ...current.filter((item) => item.id !== "new"),
                    {
                      id: "new",
                      title: "Nuevo",
                      description: "Actualización externa",
                      icon: "download-cloud",
                    },
                  ]);
                }, 1000);
              }
            : undefined
        }
        onReorderRejected={() => setAction("Actualización externa conservada")}
        renderControls={
          custom
            ? ({ dragHandle, moveUp, moveDown, canMoveUp, canMoveDown, item }) => (
                <View style={{ gap: 4 }}>
                  {dragHandle}
                  <Pressable
                    accessibilityLabel={`Priorizar ${item.title}`}
                    disabled={!canMoveUp}
                    onPress={moveUp}
                    style={{ minHeight: 48, minWidth: 48, justifyContent: "center" }}
                  >
                    <Typography.Text className="text-text-accent" variant="bodySmall">
                      Primero
                    </Typography.Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Posponer ${item.title}`}
                    disabled={!canMoveDown}
                    onPress={moveDown}
                    style={{ minHeight: 48, minWidth: 48, justifyContent: "center" }}
                  >
                    <Typography.Text className="text-text-accent" variant="bodySmall">
                      Después
                    </Typography.Text>
                  </Pressable>
                </View>
              )
            : undefined
        }
        renderHandleContent={custom ? () => <Icon name="stop" size={18} /> : undefined}
        renderItem={({ item, index }) => (
          <Pressable
            accessibilityLabel={`Abrir ${item.title}`}
            onPress={() => setAction(`Abierto: ${item.title}`)}
            style={{ minHeight: 48, gap: 4, padding: 4 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name={item.icon} size={18} />
              <Typography.Text style={{ flex: 1 }} variant={custom ? "label" : "body"}>
                {index + 1}. {item.title}
              </Typography.Text>
            </View>
            <Typography.Text className="text-text-secondary" variant="bodySmall">
              {long
                ? `${item.description}. Una descripción extensa que debe ocupar varias líneas sin fijar la altura de la fila ni ocultar sus controles.`
                : item.description}
            </Typography.Text>
          </Pressable>
        )}
        sortableProps={{ scrollableRef: scrollRef }}
        testID="sections-reorder"
      />
      <Typography.Text accessibilityLiveRegion="polite" testID="reorder-action">
        {action}
      </Typography.Text>
      <View style={{ gap: 8 }}>
        <Button
          onPress={() => setDisabled(!disabled)}
          title={disabled ? "Permitir ordenar" : "Bloquear orden"}
          variant="secondary"
        />
        <Button
          onPress={() => {
            setItems(initialItems);
            setAction("Orden restablecido");
          }}
          title="Restablecer orden"
          variant="secondary"
        />
      </View>
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Lista corta no virtualizada. Orden y acciones locales; guardar, confirmar o deshacer
        pertenece a la app.
      </Typography.Text>
    </Animated.ScrollView>
  );
}

export const Default: Story = { render: () => <ReorderExample /> };
export const Customized: Story = { render: () => <ReorderExample custom /> };
export const LongContent: Story = { render: () => <ReorderExample long /> };
export const ConcurrentUpdate: Story = { render: () => <ReorderExample concurrent /> };
