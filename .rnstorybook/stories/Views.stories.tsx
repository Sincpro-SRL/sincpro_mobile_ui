import { Typography } from "@sincpro/mobile-ui/Typography";
import ListViewV2 from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Views" };
export default meta;

type Story = StoryObj;

const tickets = [
  { id: "1", title: "Ticket #001 — Caja 1", subtitle: "Pendiente" },
  { id: "2", title: "Ticket #002 — Caja 2", subtitle: "En proceso" },
  { id: "3", title: "Ticket #003 — Caja 1", subtitle: "Cerrado" },
];

export const ListView: Story = {
  render: () => (
    <View style={{ flex: 1, minHeight: 480 }}>
      <ListViewV2.Root items={tickets} name="Tickets" onBack={() => {}} withContainer={false}>
        <ListViewV2.Header />
        <ListViewV2.Content>
          {(item) => (
            <View className="bg-bg-card p-4 border-b border-border-default">
              <Typography.Text semibold>{item.title}</Typography.Text>
              <Typography.Text className="text-text-secondary" variant="bodySmall">
                {item.subtitle}
              </Typography.Text>
            </View>
          )}
        </ListViewV2.Content>
      </ListViewV2.Root>
    </View>
  ),
};
