import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import type { KeyboardToolbarProps } from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import { Typography } from "@sincpro/mobile-ui/Typography";
import FormView from "@sincpro/mobile-ui/views/FormViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { type ComponentRef, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

const meta = {
  title: "Patterns/Forms/Keyboard navigation",
  excludeStories: ["KeyboardNavigation"],
  parameters: { layout: "fullscreen", ownsScroll: true },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export function KeyboardNavigation({
  toolbarProps,
}: {
  toolbarProps?: Omit<KeyboardToolbarProps, "onHeightChange">;
} = {}) {
  const email = useRef<ComponentRef<typeof TextInput>>(null);
  const phone = useRef<ComponentRef<typeof TextInput>>(null);
  const notes = useRef<ComponentRef<typeof TextInput>>(null);
  const [values, setValues] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saved, setSaved] = useState(false);
  const update = (key: keyof typeof values, value: string) => {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: value }));
  };
  return (
    <FormView.Root item={values} name="Contacto" withContainer={false}>
      <FormView.Header />
      <FormView.Content keyboardFormProps={{ toolbarProps }} keyboardToolbar withMargin>
        <View style={{ gap: 20, paddingTop: 16 }}>
          <Input
            label="Nombre completo"
            onChangeText={(text) => update("name", text)}
            onSubmitEditing={() => email.current?.focus()}
            returnKeyType="next"
            submitBehavior="submit"
            testID="contact-name"
            value={values.name}
          />
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            label="Correo de contacto"
            onChangeText={(text) => update("email", text)}
            onSubmitEditing={() => phone.current?.focus()}
            ref={email}
            returnKeyType="next"
            submitBehavior="submit"
            testID="contact-email"
            value={values.email}
          />
          <Input
            keyboardType="phone-pad"
            label="Teléfono de contacto"
            onChangeText={(text) => update("phone", text)}
            ref={phone}
            testID="contact-phone"
            value={values.phone}
          />
          <Input editable={false} label="Referencia de solo lectura" value="CONTACT-001" />
          <Input
            label="Notas de contacto"
            multiline
            onChangeText={(text) => update("notes", text)}
            ref={notes}
            style={{ minHeight: 140 }}
            testID="contact-notes"
            value={values.notes}
          />
          <Button
            onPress={() => {
              KeyboardController.dismiss();
              setSaved(true);
            }}
            title="Guardar contacto de ejemplo"
          />
          {saved ? (
            <Typography.Text accessibilityLiveRegion="polite">
              Contacto guardado en esta demostración
            </Typography.Text>
          ) : null}
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            Ocultar el teclado no guarda los cambios.
          </Typography.Text>
        </View>
      </FormView.Content>
    </FormView.Root>
  );
}

export const ContactForm: Story = { render: () => <KeyboardNavigation /> };

export const CustomToolbar: Story = {
  render: () => (
    <KeyboardNavigation
      toolbarProps={{
        doneLabel: "Listo",
        showDoneLabel: true,
        iconSize: 18,
        style: { borderRadius: 16, marginHorizontal: 8 },
        actionStyle: { borderRadius: 12 },
        labelStyle: { fontSize: 13 },
      }}
    />
  ),
};
