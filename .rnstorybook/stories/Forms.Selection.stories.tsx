import { Form } from "@sincpro/mobile-ui/Form";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Platform, View } from "react-native";

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
        {Platform.OS === "android"
          ? "En Android la hoja lista las opciones. Tocar una la aplica."
          : "En iOS la hoja muestra la rueda nativa. Aplicar confirma la opción."}
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

const CUSTOMERS = [
  { value: 1, label: "José Páez Núñez", description: "Cochabamba" },
  { value: 2, label: "Ana Rojas", description: "La Paz" },
  { value: 3, label: "Comercial Núñez SRL", description: "Santa Cruz" },
  { value: 4, label: "Distribuidora Andina", description: "El Alto" },
];

/**
 * PickerField: the "selector" pattern (customer, product, payment method).
 * Local options filter on the device without accents; `search` runs remotely
 * with debounce and drops stale answers.
 */
export const SearchablePicker: Story = {
  render: function SearchablePicker() {
    const [local, setLocal] = useState<number | null>(null);
    const [remote, setRemote] = useState<{ value: number; label: string } | null>(null);
    const searchRemote = async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const words = query.toLowerCase();
      return CUSTOMERS.filter((customer) => customer.label.toLowerCase().includes(words));
    };
    return (
      <View style={{ gap: 16 }}>
        <Form.PickerField
          label="Cliente (opciones locales)"
          onChange={setLocal}
          options={CUSTOMERS}
          testID="picker-local"
          value={local}
        />
        <Form.PickerField
          label="Cliente (búsqueda remota)"
          onChange={(value, option) => setRemote({ value, label: option.label })}
          search={searchRemote}
          selectedLabel={remote?.label}
          testID="picker-remote"
          value={remote?.value ?? null}
        />
      </View>
    );
  },
};
