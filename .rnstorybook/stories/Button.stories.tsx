import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "Form/Button",
  component: Form.Button,
  args: {
    title: "Acción",
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "outline", "link", "flat"],
    },
  },
} satisfies Meta<typeof Form.Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { title: "Secundario", variant: "secondary" } };

export const Outline: Story = { args: { title: "Outline", variant: "outline" } };

export const Loading: Story = { args: { title: "Cargando", loading: true } };

export const Disabled: Story = { args: { title: "Deshabilitado", disabled: true } };
