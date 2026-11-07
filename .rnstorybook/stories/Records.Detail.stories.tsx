import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import Card from "@sincpro/mobile-ui/Display/Display.Card";
import KeyValue from "@sincpro/mobile-ui/Display/Display.KeyValue";
import SectionHeader from "@sincpro/mobile-ui/Display/Display.SectionHeader";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/Records/Detail",
  excludeStories: ["RecordDetail"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export function RecordDetail({
  fail = false,
  long = false,
  startInList = false,
}: {
  fail?: boolean;
  long?: boolean;
  startInList?: boolean;
}) {
  const [showList, setShowList] = useState(startInList);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(
    long
      ? "Cliente con un nombre muy largo para verificar lectura y adaptación en pantallas pequeñas"
      : "Cliente de ejemplo",
  );
  const [savedName, setSavedName] = useState(name);
  const [status, setStatus] = useState<"idle" | "error" | "saved">("idle");
  const [retry, setRetry] = useState(false);

  const save = () => {
    if (!name.trim()) {
      setStatus("error");
      return;
    }
    if (fail && !retry) {
      setRetry(true);
      setStatus("error");
      return;
    }
    setSavedName(name);
    setEditing(false);
    setStatus("saved");
  };

  if (showList) {
    return (
      <View style={{ gap: 16, alignSelf: "stretch" }} testID="ux-record-detail">
        <Typography.Heading>Registros</Typography.Heading>
        <Card>
          <KeyValue align="stacked" label="Cliente" value={savedName} />
          <Button onPress={() => setShowList(false)} title="Ver ORD-000123" />
        </Card>
      </View>
    );
  }

  return (
    <View style={{ gap: 16, alignSelf: "stretch" }}>
      <Typography.Heading>Detalle del registro</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        Consulta los datos o edita el nombre del cliente.
      </Typography.Text>
      <Card>
        <SectionHeader className="px-0" title="Información" />
        <KeyValue align="stacked" label="Cliente" value={savedName} />
        <KeyValue align="auto" copyable label="Referencia" value="ORD-000123" />
        <KeyValue
          align="stacked"
          copyable
          label="Correo electrónico"
          value="cliente.con.referencia.larga@example.com"
        />
      </Card>
      {editing ? (
        <View style={{ gap: 12 }} testID="ux-editor">
          <SectionHeader title="Editar cliente" />
          <Input
            label="Nombre del cliente"
            onChangeText={setName}
            testID="ux-client-input"
            value={name}
          />
          {status === "error" ? (
            <Typography.Text accessibilityLiveRegion="polite">
              {name.trim()
                ? "No se pudo guardar. Tus cambios se conservan; puedes reintentar."
                : "Escribe el nombre del cliente."}
            </Typography.Text>
          ) : null}
          <Button
            onPress={save}
            title={status === "error" ? "Reintentar guardar" : "Guardar cambios"}
          />
          <Button
            onPress={() => {
              setName(savedName);
              setEditing(false);
              setStatus("idle");
            }}
            title="Cancelar"
            variant="secondary"
          />
        </View>
      ) : (
        <Button
          onPress={() => {
            setEditing(true);
            setStatus("idle");
          }}
          testID="ux-edit"
          title="Editar cliente"
        />
      )}
      {status === "saved" ? (
        <Typography.Text accessibilityLiveRegion="polite">Cambios guardados</Typography.Text>
      ) : null}
      {startInList && !editing ? (
        <Button
          onPress={() => setShowList(true)}
          title="Volver a registros"
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

export const Default: Story = { render: () => <RecordDetail /> };
export const LongContent: Story = { render: () => <RecordDetail long /> };
export const RecoverableError: Story = { render: () => <RecordDetail fail /> };
export const ListToDetail: Story = { render: () => <RecordDetail startInList /> };
