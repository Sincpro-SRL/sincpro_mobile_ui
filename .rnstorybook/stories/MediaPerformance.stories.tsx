import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Data Display/Image" };
export default meta;
type Story = StoryObj;

const PHOTO = "https://reactnative.dev/img/oss_logo.png";
const PLACEHOLDER = { blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" };

export const Recovery: Story = {
  render: function Recovery() {
    const [working, setWorking] = useState(false);
    return (
      <View className="gap-4">
        <Typography.Text>
          La fuente inválida muestra recuperación. Cambiar la fuente reinicia el estado;
          Reintentar repite la misma fuente, sin simular éxito.
        </Typography.Text>
        <Display.Image
          accessibilityLabel="Imagen de demostración"
          aspectRatio={16 / 9}
          renderError={(retry) => (
            <View className="flex-1 items-center justify-center gap-3 p-4">
              <Typography.Text accessibilityLiveRegion="polite">
                No se pudo cargar la imagen
              </Typography.Text>
              <Actions.Button onPress={retry} title="Reintentar" variant="secondary" />
            </View>
          )}
          source={{ uri: working ? PHOTO : "https://invalid.example/image.png" }}
        />
        <Actions.Button
          onPress={() => setWorking((value) => !value)}
          title={working ? "Probar fallo" : "Cambiar a fuente válida"}
          variant="secondary"
        />
      </View>
    );
  },
};

export const CachedRecycling: Story = {
  render: function CachedRecycling() {
    const [record, setRecord] = useState(1);
    return (
      <View className="gap-4">
        <Typography.Text>
          ExpoImage es opcional. recyclingKey elimina contenido de la fila anterior antes de
          cargar. Caché en disco por defecto; el host elige otra política.
        </Typography.Text>
        <ExpoImage
          accessibilityLabel={`Miniatura del registro ${record}`}
          className="w-full rounded-xl"
          contentFit="contain"
          placeholder={PLACEHOLDER}
          placeholderContentFit="contain"
          recyclingKey={`record-${record}`}
          source={PHOTO}
          style={{ aspectRatio: 16 / 9 }}
          transition={180}
        />
        <Actions.Button
          onPress={() => setRecord((value) => value + 1)}
          title="Reciclar para otro registro"
          variant="secondary"
        />
      </View>
    );
  },
};
