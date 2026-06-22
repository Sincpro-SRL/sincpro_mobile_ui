import { AspectRatio, Box, Row, Spacer, Stack } from "@sincpro/mobile-ui/primitives";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Foundations/Primitives" };
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

export const SpacerLayout: Story = {
  render: () => (
    <Row className="items-center">
      <Item label="A" />
      <Spacer flex />
      <Item label="B" />
    </Row>
  ),
};

export const AspectRatioLayout: Story = {
  render: () => (
    <View style={{ width: 200 }}>
      <AspectRatio
        className="bg-bg-muted rounded-lg items-center justify-center"
        ratio={16 / 9}
      >
        <Typography.Text>16:9</Typography.Text>
      </AspectRatio>
    </View>
  ),
};
