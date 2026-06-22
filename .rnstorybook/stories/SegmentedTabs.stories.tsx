import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Navigation/Tabs & Segmented" };
export default meta;

type Story = StoryObj;

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
  render: () => <SegmentedDemo />,
};

export const Steps: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <Navigation.Steps current={1} steps={["Carrito", "Pago", "Confirmar"]} />
      <Navigation.Steps current={2} steps={["Datos", "Envío", "Pago", "Listo"]} />
    </View>
  ),
};

export const TabsExample: Story = {
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
