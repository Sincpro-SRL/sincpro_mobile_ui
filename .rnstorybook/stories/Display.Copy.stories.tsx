import CopyableText from "@sincpro/mobile-ui/Display/Display.CopyableText";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta = {
  title: "Components/Data Display/CopyableText",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const CopyFailure: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Copia con error explícito</Typography.Heading>
      <Typography.Text>
        Este ejemplo provoca un error deliberado al resolver el valor. La acción comunica el
        fallo, no un éxito ficticio.
      </Typography.Text>
      <CopyableText
        getValue={() => {
          throw new Error("Fallo deliberado de la story");
        }}
        label="Copiar referencia"
      />
    </View>
  ),
};

export const ShortAndLongText: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Typography.Heading variant="h3">Datos y texto seleccionable</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        Una referencia corta se copia al tocar el dato. Una descripción permite seleccionar un
        fragmento; el icono copia el texto completo. El check confirma sin mover la pantalla.
      </Typography.Text>
      <CopyableText accessibilityLabel="Copiar referencia" value="REF-001" />
      <CopyableText
        accessibilityLabel="Copiar descripción"
        selectable
        value="Esta descripción es lo bastante larga para que sea útil seleccionar solo una parte, en vez de copiar automáticamente todo el contenido al tocarlo."
      />
    </View>
  ),
};
