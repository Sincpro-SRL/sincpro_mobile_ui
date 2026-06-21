import { Feedback } from "@sincpro/mobile-ui/Feedback";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Feedback" };
export default meta;

type Story = StoryObj;

export const Loading: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Feedback.Loading message="Cargando tickets..." />
    </View>
  ),
};

export const Spinner: Story = {
  render: () => <Feedback.Spinner />,
};

export const Empty: Story = {
  render: () => (
    <View style={{ height: 220 }}>
      <Feedback.Empty />
    </View>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <View style={{ height: 320 }}>
      <Feedback.Error
        message="No se pudo cargar la información"
        onHome={() => {}}
        onRetry={() => {}}
      />
    </View>
  ),
};
