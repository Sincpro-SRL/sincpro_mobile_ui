import { Display, ICON_MAP, type IconName } from "@sincpro/mobile-ui/Display";
import LogoIcon from "@sincpro/mobile-ui/icons/LogoIcon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Foundations/Icons" };
export default meta;

const names = Object.keys(ICON_MAP).filter((name): name is IconName => name in ICON_MAP);

function SemanticGallery() {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
      {names.map((name) => (
        <View key={name} style={{ alignItems: "center", width: 88, gap: 8 }}>
          <Display.Icon
            color={theme.icon.primary}
            name={name}
            size={28}
            testID={`icon-${name}`}
          />
          <Typography.Text align="center" variant="caption">
            {name}
          </Typography.Text>
        </View>
      ))}
    </View>
  );
}

export const Grid: StoryObj = { render: () => <SemanticGallery /> };

export const Branding: StoryObj = {
  render: () => (
    <View style={{ alignItems: "center", gap: 12 }}>
      <LogoIcon size={64} />
      <Typography.Text>Branding SVG separado de los iconos de plataforma.</Typography.Text>
    </View>
  ),
};
