/**
 * Views/List/Content — sub-componentes de ListViewV2.Content.Row:
 * Row · Avatar · Content · Title (badge, rightComponent) · Subtitle · Footer · Actions · ActionButton.
 * No necesitan Root/Provider — son las piezas con las que armás cada fila.
 */
import { Display } from "@sincpro/mobile-ui/Display";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import ListViewV2 from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

import { LeadingIcon } from "./views.helpers";

const meta: Meta = { title: "Views/List/Content" };
export default meta;
type Story = StoryObj;

function ListViewAllRowVariantsStory() {
  return (
    <View style={{ alignSelf: "stretch", gap: 12 }}>
      {/* 1: básico */}
      <View>
        <Display.SectionHeader title="Row básica" />
        <View style={{ backgroundColor: theme.bg.card }}>
          <ListViewV2.Content.Row>
            <ListViewV2.Content.Row.Avatar>
              <LeadingIcon name="cube-outline" />
            </ListViewV2.Content.Row.Avatar>
            <ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Title>Producto básico</ListViewV2.Content.Row.Title>
              <ListViewV2.Content.Row.Subtitle>
                Subtítulo secundario
              </ListViewV2.Content.Row.Subtitle>
            </ListViewV2.Content.Row.Content>
          </ListViewV2.Content.Row>
        </View>
      </View>

      {/* 2: Title con badge + rightComponent */}
      <View>
        <Display.SectionHeader title="Title.badge + Title.rightComponent" />
        <View style={{ backgroundColor: theme.bg.card }}>
          <ListViewV2.Content.Row onPress={() => {}}>
            <ListViewV2.Content.Row.Avatar>
              <LeadingIcon name="receipt-outline" />
            </ListViewV2.Content.Row.Avatar>
            <ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Title
                badge={
                  <View
                    style={{
                      backgroundColor: theme.accent,
                      borderRadius: 99,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Typography.Text
                      style={{ color: theme.text.onAccent, fontSize: 10 }}
                      variant="captionSmall"
                    >
                      Nuevo
                    </Typography.Text>
                  </View>
                }
                rightComponent={<Typography.Text variant="data">Bs 320.00</Typography.Text>}
              >
                Pedido #001
              </ListViewV2.Content.Row.Title>
              <ListViewV2.Content.Row.Subtitle>
                Cliente: Juan Pérez
              </ListViewV2.Content.Row.Subtitle>
            </ListViewV2.Content.Row.Content>
          </ListViewV2.Content.Row>
        </View>
      </View>

      {/* 3: Row.Footer con left/right */}
      <View>
        <Display.SectionHeader title="Row.Footer left + right" />
        <View style={{ backgroundColor: theme.bg.card }}>
          <ListViewV2.Content.Row onPress={() => {}}>
            <ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Title>
                Factura #F-2024-0042
              </ListViewV2.Content.Row.Title>
              <ListViewV2.Content.Row.Subtitle>Emitida hoy</ListViewV2.Content.Row.Subtitle>
              <ListViewV2.Content.Row.Footer
                left={
                  <View
                    style={{
                      backgroundColor: theme.bg.muted,
                      borderRadius: 99,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Typography.Text variant="captionSmall">Pendiente</Typography.Text>
                  </View>
                }
                right={<Typography.Text variant="data">14:32</Typography.Text>}
              />
            </ListViewV2.Content.Row.Content>
          </ListViewV2.Content.Row>
        </View>
      </View>

      {/* 4: Row.Actions + ActionButton */}
      <View>
        <Display.SectionHeader title="Row.Actions + ActionButton" />
        <View style={{ backgroundColor: theme.bg.card }}>
          <ListViewV2.Content.Row>
            <ListViewV2.Content.Row.Avatar>
              <LeadingIcon name="document-outline" />
            </ListViewV2.Content.Row.Avatar>
            <ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Title>
                Documento importante
              </ListViewV2.Content.Row.Title>
              <ListViewV2.Content.Row.Subtitle>PDF · 2.3 MB</ListViewV2.Content.Row.Subtitle>
            </ListViewV2.Content.Row.Content>
            <ListViewV2.Content.Row.Actions>
              <ListViewV2.Content.Row.ActionButton
                icon={
                  <Display.Icon
                    color={theme.icon.primary}
                    name="share-outline"
                    size={18}
                    type="ionicons"
                  />
                }
                onPress={() => {}}
              />
              <ListViewV2.Content.Row.ActionButton
                icon={
                  <Display.Icon
                    color={theme.icon.primary}
                    name="trash-outline"
                    size={18}
                    type="ionicons"
                  />
                }
                onPress={() => {}}
              />
            </ListViewV2.Content.Row.Actions>
          </ListViewV2.Content.Row>
        </View>
      </View>
    </View>
  );
}

export const AllRowVariants: Story = { render: () => <ListViewAllRowVariantsStory /> };
