import { Actions } from "@sincpro/mobile-ui/Actions";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const VARIANTS = [
  "primary",
  "accent",
  "cta",
  "secondary",
  "outline",
  "outlineDanger",
  "outlineBlack",
  "flat",
  "link",
  "transparent",
] as const;

const meta = {
  title: "Components/Actions/Button",
  component: Actions.Button,
  args: {
    title: "Acción",
    variant: "primary",
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
} satisfies Meta<typeof Actions.Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ActionHierarchy: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Actions.Button title="Guardar cambios" />
      <Actions.Button title="Cancelar edición" variant="secondary" />
      <Actions.Button title="Ver historial" variant="link" />
      <Actions.Button title="Eliminar registro" variant="outlineDanger" />
    </View>
  ),
};

export const BusyAndDisabled: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Actions.Button loading title="Guardando cambios" />
      <Actions.Button disabled title="Continuar" />
      <Typography.Text>Completa los campos obligatorios para continuar.</Typography.Text>
    </View>
  ),
};

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {VARIANTS.map((variant) => (
        <View key={variant} style={{ gap: 4 }}>
          <Typography.Text className="text-text-secondary text-xs">{variant}</Typography.Text>
          <Actions.Button title={`Button ${variant}`} variant={variant} />
        </View>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button size="small" title="Small" />
      <Actions.Button size="medium" title="Medium" />
      <Actions.Button size="large" title="Large" />
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button title="Default" />
      <Actions.Button loading title="Loading" />
      <Actions.Button disabled title="Disabled" />
    </View>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Actions.Button.Icon icon="home" variant="primary" />
      <Actions.Button.Icon icon="settings" variant="secondary" />
      <Actions.Button.Icon icon="delete" variant="outlineDanger" />
    </View>
  ),
};

const HIERARCHY = [
  { level: "Primary — acción principal", variant: "primary" },
  { level: "CTA — realce (1 por vista)", variant: "cta" },
  { level: "Secondary — bajo perfil", variant: "secondary" },
  { level: "Tertiary — link/inline", variant: "link" },
  { level: "Destructive — peligrosa", variant: "outlineDanger" },
] as const;

export const Hierarchy: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {HIERARCHY.map(({ level, variant }) => (
        <View key={variant} style={{ gap: 4 }}>
          <Typography.Text className="text-text-secondary text-xs">{level}</Typography.Text>
          <Actions.Button title={level} variant={variant} />
        </View>
      ))}
    </View>
  ),
};
