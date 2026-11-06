import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

const meta: Meta = { title: "Components/Actions" };
export default meta;

type Story = StoryObj;

// ─── Button ───────────────────────────────────────────────────────────────────

export const Buttons: Story = {
  name: "Button — variants",
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button onPress={() => {}} title="primary (default)" />
      <Actions.Button onPress={() => {}} title="accent" variant="accent" />
      <Actions.Button onPress={() => {}} title="secondary" variant="secondary" />
      <Actions.Button onPress={() => {}} title="outline" variant="outline" />
      <Actions.Button onPress={() => {}} title="outlineDanger" variant="outlineDanger" />
      <Actions.Button onPress={() => {}} title="flat" variant="flat" />
      <Actions.Button onPress={() => {}} title="link" variant="link" />
      <Actions.Button loading onPress={() => {}} title="loading…" />
      <Actions.Button disabled onPress={() => {}} title="disabled" />
    </View>
  ),
};

export const ButtonSizes: Story = {
  name: "Button — sizes",
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button onPress={() => {}} size="small" title="small" />
      <Actions.Button onPress={() => {}} size="medium" title="medium (default)" />
      <Actions.Button onPress={() => {}} size="large" title="large" />
    </View>
  ),
};

// ─── IconButton ───────────────────────────────────────────────────────────────

export const IconButtons: Story = {
  name: "IconButton",
  render: () => (
    <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
      <Actions.IconButton icon="add" onPress={() => {}} type="ionicons" />
      <Actions.IconButton
        icon="trash"
        onPress={() => {}}
        type="ionicons"
        variant="secondary"
      />
      <Actions.IconButton
        icon="share-outline"
        onPress={() => {}}
        type="ionicons"
        variant="primary"
      />
      <Actions.IconButton
        icon="settings-outline"
        onPress={() => {}}
        rounded
        type="ionicons"
      />
    </View>
  ),
};

// ─── FAB ─────────────────────────────────────────────────────────────────────

export const FABStory: Story = {
  name: "FAB",
  render: () => (
    <View style={{ height: 200 }}>
      <Actions.FAB icon="add" onPress={() => {}} />
      <Actions.FAB icon="create" label="Nuevo" onPress={() => {}} position="bottom-left" />
    </View>
  ),
};

// ─── FilterButton ─────────────────────────────────────────────────────────────

function FilterDemo() {
  const [active, setActive] = useState("all");
  const options = ["all", "active", "done", "error"];
  return (
    <Actions.FilterButtonGroup>
      {options.map((opt) => (
        <Actions.FilterButton
          active={active === opt}
          key={opt}
          onPress={() => setActive(opt)}
          title={
            opt === "all"
              ? "Todos"
              : opt === "active"
                ? "Activos"
                : opt === "done"
                  ? "Listos"
                  : "Error"
          }
        />
      ))}
    </Actions.FilterButtonGroup>
  );
}

export const FilterButtons: Story = {
  name: "FilterButton",
  render: () => <FilterDemo />,
};

export const ActionDock: Story = {
  name: "Dock — swipe-expandable fixed action",
  parameters: { layout: "fullscreen", ownsScroll: true },
  render: () => <ActionDockDemo />,
};

function ActionDockDemo() {
  const [confirmed, setConfirmed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");

  return (
    <View className="relative flex-1 bg-bg-page">
      <ScrollView
        contentContainerStyle={{ gap: 12, padding: 20, paddingBottom: 180 }}
        style={{ flex: 1 }}
      >
        <Display.SectionHeader
          subtitle="El resumen se despliega sobre el contenido sin mover el botón fijo."
          title="Pedido #1024"
        />
        <Typography.Text className="text-text-secondary" variant="body">
          Desliza la manija hacia arriba o toca “Más opciones”. Desliza hacia abajo para
          contraer. El panel superpuesto mantiene visible la acción principal.
        </Typography.Text>
        {confirmed ? <Display.Tag dotColor="#16A34A" label="Pedido confirmado" /> : null}
        {reviewed ? <Display.Tag label="Pedido revisado" /> : null}
        <Typography.Text variant="body">
          {note ? `Nota: ${note}` : "Sin nota"}
        </Typography.Text>
        <Typography.Text className="text-text-secondary" variant="body">
          Este contenido puede desplazarse debajo del Dock; el panel se muestra encima sin
          recortar la pantalla.
        </Typography.Text>
        <Typography.Text className="text-text-secondary" variant="body">
          Prueba también un gesto diagonal: no debería abrir o cerrar accidentalmente el
          panel.
        </Typography.Text>
      </ScrollView>
      <Actions.Dock
        expanded={expanded}
        maxExpandedHeightRatio={0.45}
        onExpandedChange={setExpanded}
        primaryAction={
          <Actions.Button
            disabled={confirmed}
            onPress={() => {
              setConfirmed(true);
              setExpanded(false);
            }}
            title={confirmed ? "Confirmado" : "Confirmar pedido"}
          />
        }
        summary={
          <Display.AmountSummary.Root currencySymbol="Bs" variant="plain">
            <Display.AmountSummary.Total label="Total" value={128.5} />
          </Display.AmountSummary.Root>
        }
        testID="story-dock"
        title="Detalle del pedido"
      >
        <Display.AmountSummary.Root currencySymbol="Bs" variant="plain">
          <Display.AmountSummary.Row label="Subtotal" value={120} />
          <Display.AmountSummary.Row label="Envío" value={8.5} />
          <Display.AmountSummary.Total label="Total" value={128.5} />
        </Display.AmountSummary.Root>
        <Actions.Button
          className="mt-3"
          onPress={() => setReviewed((value) => !value)}
          title={reviewed ? "Quitar revisión" : "Marcar como revisado"}
          variant="secondary"
        />
        <TextInput
          accessibilityLabel="Nota del pedido"
          className="my-3 min-h-12 rounded-lg border border-border-light px-3 text-text-primary"
          onChangeText={setNote}
          placeholder="Nota del pedido"
          testID="dock-note"
          value={note}
        />
        {Array.from({ length: 8 }, (_, index) => (
          <Typography.Text className="py-3" key={index} variant="body">
            {`Opción adicional ${index + 1}`}
          </Typography.Text>
        ))}
      </Actions.Dock>
    </View>
  );
}

// ─── CircleButton ─────────────────────────────────────────────────────────────

export const CircleButtonStory: Story = {
  name: "CircleButton",
  render: () => (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <Display.CircleButton customIcon={HomeIcon} size="sm" />
        <Display.CircleButton customIcon={HomeIcon} size="md" />
        <Display.CircleButton customIcon={HomeIcon} size="lg" />
      </View>
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <Display.CircleButton customIcon={ProfileIcon} size="md" variant="primary" />
        <Display.CircleButton customIcon={BoxTimeIcon} size="md" variant="danger" />
        <Display.CircleButton customIcon={SettingsIcon} size="md" variant="success" />
      </View>
    </View>
  ),
};
