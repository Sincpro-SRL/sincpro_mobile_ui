import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import { CircleButton } from "@sincpro/mobile-ui/widgets/CircleButton";
import JsonPreview from "@sincpro/mobile-ui/widgets/JSONViewer";
import { MenuCard } from "@sincpro/mobile-ui/widgets/MenuCard";
import { MenuGrid, type MenuItem } from "@sincpro/mobile-ui/widgets/MenuGrid";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Patterns/Widgets" };
export default meta;

type Story = StoryObj;

const items: MenuItem[] = [
  { id: "1", title: "Odoo", customIcon: HomeIcon },
  { id: "2", title: "Eventos", customIcon: HomeIcon },
  { id: "3", title: "Impresora", customIcon: HomeIcon },
  { id: "4", title: "Perfil", customIcon: HomeIcon },
];

export const CircleButtonWidget: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <CircleButton customIcon={HomeIcon} />
      <CircleButton customIcon={HomeIcon} size="md" />
    </View>
  ),
};

export const MenuCardWidget: Story = {
  render: () => <MenuCard customIcon={HomeIcon} onPress={() => {}} title="Tickets" />,
};

export const MenuGridWidget: Story = {
  render: () => <MenuGrid items={items} />,
};

export const JsonViewer: Story = {
  render: () => (
    <JsonPreview
      selectedJson={JSON.stringify({ id: 1, name: "ticket", ok: true }, null, 2)}
    />
  ),
};
