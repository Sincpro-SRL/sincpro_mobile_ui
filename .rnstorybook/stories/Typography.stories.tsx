import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "Typography/Text",
  component: Typography.Text,
  args: {
    children: "El veloz murciélago hindú",
    variant: "body",
  },
} satisfies Meta<typeof Typography.Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Heading: Story = { args: { children: "Título", variant: "h3", bold: true } };

export const Caption: Story = { args: { children: "Texto pequeño", variant: "caption" } };
