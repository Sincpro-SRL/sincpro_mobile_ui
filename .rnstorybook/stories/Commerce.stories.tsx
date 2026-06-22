import { Display } from "@sincpro/mobile-ui/Display";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/Commerce" };
export default meta;

type Story = StoryObj;

const PHOTO = { uri: "https://reactnative.dev/img/oss_logo.png" };

export const PriceTag: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Display.PriceTag amount={89.9} />
      <Display.PriceTag amount={59.9} originalAmount={89.9} size="lg" />
    </View>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Display.ProductCard
          badge={<Display.Badge label="-33%" variant="danger" />}
          image={PHOTO}
          onPress={() => {}}
          originalPrice={89.9}
          price={59.9}
          rating={4}
          subtitle="500ml"
          title="Producto demo"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Display.ProductCard
          image={PHOTO}
          onPress={() => {}}
          price={120}
          subtitle="Unidad"
          title="Otro producto"
        />
      </View>
    </View>
  ),
};
