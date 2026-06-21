import Container from "@sincpro/mobile-ui/layouts/Container";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Layouts" };
export default meta;

type Story = StoryObj;

export const ContainerLayout: Story = {
  render: () => (
    <Container>
      <Typography.Text>Contenido dentro de Container</Typography.Text>
    </Container>
  ),
};

export const Gradient: Story = {
  render: () => (
    <GradientContainer className="p-6 rounded-lg">
      <Typography.Text className="text-text-inverse">GradientContainer</Typography.Text>
    </GradientContainer>
  ),
};

export const Scroll: Story = {
  render: () => (
    <ScrollContainer>
      {Array.from({ length: 12 }).map((_, i) => (
        <View className="bg-bg-muted p-4 my-1 rounded" key={i}>
          <Typography.Text>Fila {i + 1}</Typography.Text>
        </View>
      ))}
    </ScrollContainer>
  ),
};
