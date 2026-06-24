import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Navigation/Tabs & Segmented" };
export default meta;

type Story = StoryObj;

// ─── Text-only ───────────────────────────────────────────────────────────────

const VIEWS = [
  { label: "Lista", value: "list" },
  { label: "Mapa", value: "map" },
  { label: "Cuadrícula", value: "grid" },
] as const;

function SegmentedDemo() {
  const [view, setView] = useState<(typeof VIEWS)[number]["value"]>("list");
  return (
    <View style={{ gap: 12 }}>
      <Navigation.SegmentedControl onChange={setView} options={[...VIEWS]} value={view} />
      <Typography.Text className="text-text-secondary">Vista activa: {view}</Typography.Text>
    </View>
  );
}

export const Segmented: Story = {
  name: "Segmented — text only",
  render: () => <SegmentedDemo />,
};

// ─── With icons (top layout) ─────────────────────────────────────────────────

const ICON_VIEWS_TOP = [
  { label: "Inicio", value: "home", icon: "home-outline" },
  { label: "Mapa", value: "map", icon: "map-outline" },
  { label: "Perfil", value: "profile", icon: "person-outline" },
] as const;

function SegmentedIconsTopDemo() {
  const [view, setView] = useState<(typeof ICON_VIEWS_TOP)[number]["value"]>("home");
  return (
    <View style={{ gap: 12 }}>
      <Navigation.SegmentedControl
        iconLayout="top"
        onChange={setView}
        options={[...ICON_VIEWS_TOP]}
        value={view}
      />
      <Typography.Text className="text-text-secondary">Vista activa: {view}</Typography.Text>
    </View>
  );
}

export const SegmentedWithIconsTop: Story = {
  name: "Segmented — icons top",
  render: () => <SegmentedIconsTopDemo />,
};

// ─── With icons (left layout) ────────────────────────────────────────────────

const ICON_VIEWS_LEFT = [
  { label: "Lista", value: "list", icon: "list-outline" },
  { label: "Grid", value: "grid", icon: "grid-outline" },
] as const;

function SegmentedIconsLeftDemo() {
  const [view, setView] = useState<(typeof ICON_VIEWS_LEFT)[number]["value"]>("list");
  return (
    <View style={{ gap: 12 }}>
      <Navigation.SegmentedControl
        iconLayout="left"
        onChange={setView}
        options={[...ICON_VIEWS_LEFT]}
        value={view}
      />
      <Typography.Text className="text-text-secondary">Vista activa: {view}</Typography.Text>
    </View>
  );
}

export const SegmentedWithIconsLeft: Story = {
  name: "Segmented — icons left",
  render: () => <SegmentedIconsLeftDemo />,
};

// ─── Steps ───────────────────────────────────────────────────────────────────

export const Steps: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <Navigation.Steps current={1} steps={["Carrito", "Pago", "Confirmar"]} />
      <Navigation.Steps current={2} steps={["Datos", "Envío", "Pago", "Listo"]} />
    </View>
  ),
};

// ─── Tabs — text only (underline) ────────────────────────────────────────────

export const TabsExample: Story = {
  name: "Tabs — text only",
  render: () => (
    <View style={{ height: 280 }}>
      <Navigation.Tabs defaultValue="detalle">
        <Navigation.Tabs.List>
          <Navigation.Tabs.Trigger value="detalle">Detalle</Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger value="items">Ítems</Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger value="historial">Historial</Navigation.Tabs.Trigger>
        </Navigation.Tabs.List>
        <Navigation.Tabs.Content value="detalle">
          <View className="p-4">
            <Typography.Text>Contenido de Detalle</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="items">
          <View className="p-4">
            <Typography.Text>Contenido de Ítems</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="historial">
          <View className="p-4">
            <Typography.Text>Contenido de Historial</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
      </Navigation.Tabs>
    </View>
  ),
};

// ─── Tabs — icon left (underline) ────────────────────────────────────────────

export const TabsIconLeft: Story = {
  name: "Tabs — icon left",
  render: () => (
    <View style={{ height: 280 }}>
      <Navigation.Tabs defaultValue="pedidos">
        <Navigation.Tabs.List>
          <Navigation.Tabs.Trigger icon="receipt-outline" value="pedidos">
            Pedidos
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="map-outline" value="mapa">
            Mapa
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="person-outline" value="perfil">
            Perfil
          </Navigation.Tabs.Trigger>
        </Navigation.Tabs.List>
        <Navigation.Tabs.Content value="pedidos">
          <View className="p-4">
            <Typography.Text>Lista de pedidos</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="mapa">
          <View className="p-4">
            <Typography.Text>Vista de mapa</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="perfil">
          <View className="p-4">
            <Typography.Text>Perfil del conductor</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
      </Navigation.Tabs>
    </View>
  ),
};

// ─── Tabs — icon top (underline) ─────────────────────────────────────────────

export const TabsIconTop: Story = {
  name: "Tabs — icon top",
  render: () => (
    <View style={{ height: 300 }}>
      <Navigation.Tabs defaultValue="info">
        <Navigation.Tabs.List>
          <Navigation.Tabs.Trigger
            icon="information-circle-outline"
            iconLayout="top"
            value="info"
          >
            Info
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="cube-outline" iconLayout="top" value="items">
            Ítems
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="time-outline" iconLayout="top" value="log">
            Historial
          </Navigation.Tabs.Trigger>
        </Navigation.Tabs.List>
        <Navigation.Tabs.Content value="info">
          <View className="p-4">
            <Typography.Text>Información del pedido</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="items">
          <View className="p-4">
            <Typography.Text>Productos del pedido</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="log">
          <View className="p-4">
            <Typography.Text>Registro de cambios</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
      </Navigation.Tabs>
    </View>
  ),
};

// ─── Tabs — filled variant ────────────────────────────────────────────────────

export const TabsFilled: Story = {
  name: "Tabs — filled",
  render: () => (
    <View style={{ height: 280, padding: 16 }}>
      <Navigation.Tabs defaultValue="activos" variant="filled">
        <Navigation.Tabs.List>
          <Navigation.Tabs.Trigger value="activos">Activos</Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger value="pendientes">Pendientes</Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger value="cerrados">Cerrados</Navigation.Tabs.Trigger>
        </Navigation.Tabs.List>
        <Navigation.Tabs.Content value="activos">
          <View className="p-4">
            <Typography.Text>Tickets activos</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="pendientes">
          <View className="p-4">
            <Typography.Text>Tickets pendientes</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="cerrados">
          <View className="p-4">
            <Typography.Text>Tickets cerrados</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
      </Navigation.Tabs>
    </View>
  ),
};

// ─── Tabs — filled + icon ─────────────────────────────────────────────────────

export const TabsFilledIcons: Story = {
  name: "Tabs — filled + icon",
  render: () => (
    <View style={{ height: 280, padding: 16 }}>
      <Navigation.Tabs defaultValue="lista" variant="filled">
        <Navigation.Tabs.List>
          <Navigation.Tabs.Trigger icon="list-outline" value="lista">
            Lista
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="grid-outline" value="grid">
            Grid
          </Navigation.Tabs.Trigger>
          <Navigation.Tabs.Trigger icon="map-outline" value="mapa">
            Mapa
          </Navigation.Tabs.Trigger>
        </Navigation.Tabs.List>
        <Navigation.Tabs.Content value="lista">
          <View className="p-4">
            <Typography.Text>Vista lista</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="grid">
          <View className="p-4">
            <Typography.Text>Vista grid</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
        <Navigation.Tabs.Content value="mapa">
          <View className="p-4">
            <Typography.Text>Vista mapa</Typography.Text>
          </View>
        </Navigation.Tabs.Content>
      </Navigation.Tabs>
    </View>
  ),
};
