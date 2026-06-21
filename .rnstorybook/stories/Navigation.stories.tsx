import { Navigation } from "@sincpro/mobile-ui/Navigation";
import type { Meta, StoryObj } from "@storybook/react-native";

const meta: Meta = { title: "Navigation" };
export default meta;

type Story = StoryObj;

export const Header: Story = {
  render: () => <Navigation.Header title="Tickets" />,
};

export const HeaderWithBack: Story = {
  render: () => (
    <Navigation.Header backButton handleBackButton={() => {}} title="Detalle del ticket" />
  ),
};
