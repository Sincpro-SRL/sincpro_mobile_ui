import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Data Display" };
export default meta;

type Story = StoryObj;

export const Badge: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      <Display.Badge label="Éxito" variant="success" />
      <Display.Badge label="Aviso" variant="warning" />
      <Display.Badge label="Error" variant="danger" />
      <Display.Badge label="Info" variant="info" />
    </View>
  ),
};

export const Avatar: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Display.Avatar initials="AG" />
      <Display.Avatar initials="JS" size={64} />
    </View>
  ),
};

export const Icon: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <Display.Icon name="home" size={28} type="ionicons" />
      <Display.Icon name="settings" size={28} type="material" />
      <Display.Icon name="check" size={28} type="feather" />
    </View>
  ),
};

export const Monetary: Story = {
  render: () => (
    <View style={{ gap: 6 }}>
      <Display.Monetary value={1234.5} />
      <Display.Monetary value={0} />
    </View>
  ),
};

export const CountRecords: Story = {
  render: () => <Display.CountRecords count={42} name="tickets" />,
};

export const Divider: Story = {
  render: () => (
    <View style={{ width: 240 }}>
      <Display.Divider />
    </View>
  ),
};

export const CopyableText: Story = {
  render: () => <Display.CopyableText label="ID" value="TCK-000123" />,
};

export const Card: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Display.Card elevation="md">
        <Display.Card.Title>Card con título</Display.Card.Title>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          Superficie tokenizada con elevación y slots Title/Footer.
        </Typography.Text>
        <Display.Card.Footer>
          <Form.Button size="small" title="Acción" variant="cta" />
        </Display.Card.Footer>
      </Display.Card>
      <Display.Card onPress={() => {}}>
        <Typography.Text>Card presionable</Typography.Text>
      </Display.Card>
    </View>
  ),
};

export const Chip: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Display.Chip label="Neutral" tone="neutral" />
        <Display.Chip label="Primary" tone="primary" />
        <Display.Chip label="Success" tone="success" />
        <Display.Chip label="Warning" tone="warning" />
        <Display.Chip label="Danger" tone="danger" />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Display.Chip label="Seleccionado" onPress={() => {}} selected tone="primary" />
        <Display.Chip label="Removible" onRemove={() => {}} tone="neutral" />
      </View>
    </View>
  ),
};

export const Accordion: Story = {
  render: () => (
    <Display.Accordion>
      <Display.Accordion.Item defaultOpen title="¿Qué es Sincpro Mobile?">
        <Typography.Text className="text-text-secondary">
          Un framework móvil con design system propio.
        </Typography.Text>
      </Display.Accordion.Item>
      <Display.Accordion.Item title="¿Cómo se extiende?">
        <Typography.Text className="text-text-secondary">
          Con tokens, variantes y componentes nuevos — sin forkear.
        </Typography.Text>
      </Display.Accordion.Item>
    </Display.Accordion>
  ),
};

export const ListItem: Story = {
  render: () => (
    <View className="bg-bg-card rounded-lg overflow-hidden">
      <Display.ListItem
        leading={<Display.Icon name="person-circle" size={28} />}
        onPress={() => {}}
        subtitle="Editar tu información"
        title="Perfil"
        trailing={<Display.Icon name="chevron-forward" size={18} />}
      />
      <Display.ListItem
        leading={<Display.Icon name="notifications" size={28} />}
        onPress={() => {}}
        subtitle="Activadas"
        title="Notificaciones"
        trailing={<Display.Badge label="3" variant="info" />}
      />
      <Display.ListItem
        leading={<Display.Icon name="card" size={28} />}
        showDivider={false}
        subtitle="Bs 1.250,00"
        title="Saldo"
      />
    </View>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <Display.AvatarGroup
      items={[
        { initials: "AG" },
        { initials: "JS" },
        { initials: "ML" },
        { initials: "RP" },
        { initials: "TC" },
        { initials: "Vz" },
      ]}
      max={4}
    />
  ),
};

function RatingDemo() {
  const [value, setValue] = useState(3);
  return (
    <View style={{ gap: 12 }}>
      <Display.Rating onChange={setValue} value={value} />
      <Display.Rating readOnly size={18} value={4} />
    </View>
  );
}

export const Rating: Story = { render: () => <RatingDemo /> };

export const SwipeableRow: Story = {
  render: () => (
    <View className="bg-bg-card rounded-lg overflow-hidden">
      <Display.SwipeableRow
        rightActions={[
          { icon: "archive", color: "#64748B", label: "Archivar", onPress: () => {} },
          { icon: "trash", label: "Eliminar", onPress: () => {} },
        ]}
      >
        <Display.ListItem
          showDivider={false}
          subtitle="Deslizá a la izquierda →"
          title="Ticket #001"
        />
      </Display.SwipeableRow>
    </View>
  ),
};
