/**
 * Views/Form/Content — piezas de contenido de FormViewV2.Content:
 * Group/Section (con title) y cómo Content responde a loading/error/empty.
 */
import { Form } from "@sincpro/mobile-ui/Form";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import FormViewV2 from "@sincpro/mobile-ui/views/FormViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import { SectionLabel } from "./views.helpers";

const meta: Meta = { title: "Views/Form/Content" };
export default meta;
type Story = StoryObj;

/**
 * API: Content.Group — construido sobre Display.Card.
 * DEFAULT = plano (elevation="none") + padding "md" (16px) → el título se alinea
 * con los labels de los campos, sin sombra "voladora".
 *
 * Separación: un solo Group = un card continuo (sin separación). Varios Group
 * (withMargin=true, default) = secciones separadas. withMargin={false} = al ras.
 * Estilo elevado opcional: elevation="sm" | "md".
 */
export const GroupDefaults: Story = {
  render: () => (
    <View
      style={{
        alignSelf: "stretch",
        backgroundColor: theme.bg.muted,
        gap: 4,
        paddingVertical: 12,
      }}
    >
      <SectionLabel>DEFAULT · un solo Group = un card plano (sin separación)</SectionLabel>
      <FormViewV2.Content.Group>
        <Form.Input label="Nombre completo" onChangeText={() => {}} value="Juan Pérez" />
        <Form.Input label="Teléfono" onChangeText={() => {}} value="+591 70000000" />
        <Form.Input label="Ciudad" onChangeText={() => {}} value="La Paz" />
      </FormViewV2.Content.Group>

      <SectionLabel>
        DEFAULT (withMargin=true) · varios Group = secciones separadas (título alineado)
      </SectionLabel>
      <FormViewV2.Content.Group title="Información">
        <Form.Input label="Nombre" onChangeText={() => {}} value="Juan Pérez" />
      </FormViewV2.Content.Group>
      <FormViewV2.Content.Group title="Dirección">
        <Form.Input label="Ciudad" onChangeText={() => {}} value="La Paz" />
      </FormViewV2.Content.Group>

      <SectionLabel>
        variant=&quot;plain&quot; · sin card — contenido directo (los inputs ya son cards)
      </SectionLabel>
      <FormViewV2.Content.Group title="Información" variant="plain">
        <Form.Input label="Nombre" onChangeText={() => {}} value="Juan Pérez" />
        <Form.Input label="Teléfono" onChangeText={() => {}} value="+591 70000000" />
      </FormViewV2.Content.Group>

      <SectionLabel>
        elevation=&quot;sm&quot; · estilo elevado opcional (card que resalta)
      </SectionLabel>
      <FormViewV2.Content.Group elevation="sm" title="Resumen">
        <Form.Input label="Total" onChangeText={() => {}} value="Bs 1.250,00" />
      </FormViewV2.Content.Group>

      <SectionLabel>
        withMargin=false · cards al ras, sin margen (layouts propios)
      </SectionLabel>
      <FormViewV2.Content.Group withMargin={false}>
        <Form.Input label="Alias" onChangeText={() => {}} value="Impresora principal" />
      </FormViewV2.Content.Group>
      <FormViewV2.Content.Group withMargin={false}>
        <Form.Input label="Puerto" onChangeText={() => {}} value="9100" />
      </FormViewV2.Content.Group>
    </View>
  ),
};

/**
 * Comparación directa: el MISMO contenido con card (variant="card", default) vs sin card
 * (variant="plain"). Mismo posicionamiento e indent del título; plain solo quita el frame.
 */
export const CardVsPlain: Story = {
  render: () => (
    <View
      style={{
        alignSelf: "stretch",
        backgroundColor: theme.bg.muted,
        gap: 4,
        paddingVertical: 12,
      }}
    >
      <SectionLabel>
        variant=&quot;card&quot; (default) — con frame (borde + fondo)
      </SectionLabel>
      <FormViewV2.Content.Group title="Información personal">
        <Form.Input label="Nombre completo" onChangeText={() => {}} value="Juan Pérez" />
        <Form.Input label="Teléfono" onChangeText={() => {}} value="+591 70000000" />
      </FormViewV2.Content.Group>

      <SectionLabel>variant=&quot;plain&quot; — sin frame, mismo lugar</SectionLabel>
      <FormViewV2.Content.Group title="Información personal" variant="plain">
        <Form.Input label="Nombre completo" onChangeText={() => {}} value="Juan Pérez" />
        <Form.Input label="Teléfono" onChangeText={() => {}} value="+591 70000000" />
      </FormViewV2.Content.Group>
    </View>
  ),
};

/**
 * Matriz margin × variant — las 4 combinaciones. `withMargin` controla el inset lateral
 * (16px vs al ras) y `variant` el frame (card vs plain); son independientes entre sí.
 */
export const MarginAndVariant: Story = {
  render: () => (
    <View
      style={{
        alignSelf: "stretch",
        backgroundColor: theme.bg.muted,
        gap: 8,
        paddingVertical: 12,
      }}
    >
      <SectionLabel>withMargin=true · card (DEFAULT)</SectionLabel>
      <FormViewV2.Content.Group title="Sección">
        <Form.Input label="Campo" onChangeText={() => {}} value="Valor" />
      </FormViewV2.Content.Group>

      <SectionLabel>withMargin=false · card (card al ras)</SectionLabel>
      <FormViewV2.Content.Group title="Sección" withMargin={false}>
        <Form.Input label="Campo" onChangeText={() => {}} value="Valor" />
      </FormViewV2.Content.Group>

      <SectionLabel>withMargin=true · plain (sin card, con inset)</SectionLabel>
      <FormViewV2.Content.Group title="Sección" variant="plain">
        <Form.Input label="Campo" onChangeText={() => {}} value="Valor" />
      </FormViewV2.Content.Group>

      <SectionLabel>withMargin=false · plain (sin card y al ras)</SectionLabel>
      <FormViewV2.Content.Group title="Sección" variant="plain" withMargin={false}>
        <Form.Input label="Campo" onChangeText={() => {}} value="Valor" />
      </FormViewV2.Content.Group>
    </View>
  ),
};

/**
 * API: Content.Group `title` — SectionHeader encima del card de inputs.
 * Úsalo cuando los grupos tienen semántica distinta (Información / Dirección / Notas).
 */
function FormViewGroupWithTitleStory() {
  const [name, setName] = useState("Juan Pérez");
  const [phone, setPhone] = useState("+591 70000000");
  const [city, setCity] = useState("La Paz");
  const [notes, setNotes] = useState("");

  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        item={{ name }}
        name="Nuevo cliente"
        onBack={() => {}}
        withContainer={false}
      >
        <FormViewV2.Header variant="large" />

        <FormViewV2.Content>
          <FormViewV2.Content.Groups>
            {/* title prop: muestra SectionHeader sobre el card */}
            <FormViewV2.Content.Group title="Información personal">
              <Form.Input label="Nombre completo" onChangeText={setName} value={name} />
              <Form.Input
                keyboardType="phone-pad"
                label="Teléfono"
                onChangeText={setPhone}
                value={phone}
              />
            </FormViewV2.Content.Group>

            <FormViewV2.Content.Group title="Dirección">
              <Form.Input label="Ciudad" onChangeText={setCity} value={city} />
            </FormViewV2.Content.Group>

            {/* Group sin title: card sin encabezado (comportamiento original) */}
            <FormViewV2.Content.Group>
              <Form.Input
                label="Notas internas"
                onChangeText={setNotes}
                placeholder="Ej. cliente frecuente..."
                value={notes}
              />
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>

        <FormViewV2.Footer>
          <Form.Button onPress={() => {}} title="Guardar cliente" />
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  );
}

export const GroupWithTitle: Story = { render: () => <FormViewGroupWithTitleStory /> };

/**
 * API: isLoading / hasError / item=null — cómo Content responde a cada estado.
 * Los tres se pasan al Root; Content muestra el feedback correcto automáticamente.
 */
function FormViewStatesStory() {
  return (
    <View style={{ alignSelf: "stretch", gap: 12 }}>
      <Typography.Text semibold variant="caption">
        isLoading=true
      </Typography.Text>
      <View style={{ alignSelf: "stretch", height: 260 }}>
        <FormViewV2.Root
          isLoading
          item={null}
          name="Cargando datos..."
          onBack={() => {}}
          withContainer={false}
        >
          <FormViewV2.Header variant="default" />
          <FormViewV2.Content>{null}</FormViewV2.Content>
        </FormViewV2.Root>
      </View>

      <Typography.Text semibold variant="caption">
        hasError=true
      </Typography.Text>
      <View style={{ alignSelf: "stretch", height: 260 }}>
        <FormViewV2.Root
          errorMessage="Sin conexión al servidor"
          hasError
          item={null}
          name="Error"
          onBack={() => {}}
          onRetry={() => {}}
          withContainer={false}
        >
          <FormViewV2.Header variant="default" />
          <FormViewV2.Content>{null}</FormViewV2.Content>
        </FormViewV2.Root>
      </View>

      <Typography.Text semibold variant="caption">
        item=null — vacío
      </Typography.Text>
      <View style={{ alignSelf: "stretch", height: 260 }}>
        <FormViewV2.Root item={null} name="Sin datos" onBack={() => {}} withContainer={false}>
          <FormViewV2.Header variant="default" />
          <FormViewV2.Content>{null}</FormViewV2.Content>
        </FormViewV2.Root>
      </View>
    </View>
  );
}

export const States: Story = { render: () => <FormViewStatesStory /> };
