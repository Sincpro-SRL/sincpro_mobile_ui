import { Form } from "@sincpro/mobile-ui/Form";
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
  component: Form.Button,
  args: {
    title: "Acción",
    variant: "primary",
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
} satisfies Meta<typeof Form.Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {VARIANTS.map((variant) => (
        <View key={variant} style={{ gap: 4 }}>
          <Typography.Text className="text-text-secondary text-xs">{variant}</Typography.Text>
          <Form.Button title={`Button ${variant}`} variant={variant} />
        </View>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Form.Button size="small" title="Small" />
      <Form.Button size="medium" title="Medium" />
      <Form.Button size="large" title="Large" />
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Form.Button title="Default" />
      <Form.Button loading title="Loading" />
      <Form.Button disabled title="Disabled" />
    </View>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Form.Button.Icon icon="home" variant="primary" />
      <Form.Button.Icon icon="settings" variant="secondary" />
      <Form.Button.Icon icon="trash" variant="outlineDanger" />
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
          <Form.Button title={level} variant={variant} />
        </View>
      ))}
    </View>
  ),
};
