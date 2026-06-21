import { Display } from "@sincpro/mobile-ui/Display";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Display" };
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

export const DateField: Story = {
  render: () => (
    <View style={{ gap: 6 }}>
      <Display.Date value={new Date().toISOString()} />
      <Display.Date showTime value={new Date().toISOString()} />
    </View>
  ),
};

export const CopyableText: Story = {
  render: () => <Display.CopyableText label="ID" value="TCK-000123" />,
};

export const MenuButton: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Display.MenuButton icon={HomeIcon} label="Configuración" onPress={() => {}} />
    </View>
  ),
};
