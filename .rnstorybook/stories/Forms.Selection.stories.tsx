import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Components/Inputs/Select",
  excludeStories: ["MobileSelection"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export function MobileSelection({ long = false }: { long?: boolean }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Preferencias</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        La selección se abre en una hoja inferior, no en un desplegable de escritorio.
      </Typography.Text>
      <Select
        label="Canal de aviso"
        onChange={setValue}
        options={[
          { label: "Correo electrónico", value: "email" },
          {
            label: long
              ? "Notificación en el teléfono para avisos importantes y recordatorios de tareas pendientes"
              : "Notificación en el teléfono",
            value: "notification",
          },
        ]}
        title="Elegir canal de aviso"
        value={value}
      />
      <Typography.Text accessibilityLiveRegion="polite" variant="bodyLarge">
        {value
          ? `Canal elegido: ${value === "email" ? "Correo electrónico" : "Notificación en el teléfono"}`
          : "No has elegido un canal."}
      </Typography.Text>
    </View>
  );
}
export const Selection: Story = { render: () => <MobileSelection /> };
export const LongSelection: Story = { render: () => <MobileSelection long /> };
