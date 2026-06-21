import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import type { Preview } from "@storybook/react-native";
import { View } from "react-native";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfirmationProvider>
        <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
          <Story />
        </View>
      </ConfirmationProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
};

export default preview;
