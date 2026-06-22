import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/Actions" };
export default meta;

type Story = StoryObj;

export const IconButtons: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Form.IconButton icon="add" onPress={() => {}} type="ionicons" />
      <Form.IconButton icon="trash" onPress={() => {}} type="ionicons" />
      <Form.IconButton icon="share-outline" onPress={() => {}} type="ionicons" />
    </View>
  ),
};

export const FAB: Story = {
  render: () => (
    <View style={{ height: 320 }}>
      <Form.FAB icon="add" onPress={() => {}} />
      <Form.FAB icon="create" label="Nuevo" onPress={() => {}} position="bottom-left" />
    </View>
  ),
};
