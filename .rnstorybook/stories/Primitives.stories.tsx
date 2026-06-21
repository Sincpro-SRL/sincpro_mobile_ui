import { Box, Row, Stack } from "@sincpro/mobile-ui/primitives";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";

const meta: Meta = { title: "Primitives" };
export default meta;

type Story = StoryObj;

const Item = ({ label }: { label: string }) => (
  <Box className="bg-primary px-4 py-2 rounded">
    <Typography.Text className="text-text-on-primary">{label}</Typography.Text>
  </Box>
);

export const RowLayout: Story = {
  render: () => (
    <Row className="gap-2">
      <Item label="1" />
      <Item label="2" />
      <Item label="3" />
    </Row>
  ),
};

export const StackLayout: Story = {
  render: () => (
    <Stack className="gap-2">
      <Item label="A" />
      <Item label="B" />
      <Item label="C" />
    </Stack>
  ),
};

export const BoxLayout: Story = {
  render: () => (
    <Box className="bg-bg-muted p-4 rounded-lg">
      <Typography.Text>Box contenedor</Typography.Text>
    </Box>
  ),
};
