import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import ErrorSummary, {
  type ErrorSummaryItem,
} from "@sincpro/mobile-ui/Form/Form.ErrorSummary";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { type ComponentRef, useRef, useState } from "react";
import { TextInput, View } from "react-native";

const meta = {
  title: "Patterns/Forms/Validation",
  excludeStories: ["ValidationForm"],
  parameters: { layout: "fullscreen", ownsScroll: true },
} satisfies Meta;
export default meta;
type Story = StoryObj;

function validate(values: { name: string; email: string }): readonly ErrorSummaryItem[] {
  const errors: ErrorSummaryItem[] = [];
  if (values.name.trim().length < 3)
    errors.push({
      id: "name",
      label: "Nombre completo",
      message: "Escribe un nombre de al menos tres caracteres.",
    });
  if (!values.email.includes("@") || !values.email.split("@")[1]?.includes("."))
    errors.push({
      id: "email",
      label: "Correo electrónico",
      message: "Escribe un correo como nombre@ejemplo.com.",
    });
  return errors;
}

export function ValidationForm({
  customContent = false,
  presetErrors = false,
}: {
  customContent?: boolean;
  presetErrors?: boolean;
} = {}) {
  const theme = useTheme();
  const name = useRef<ComponentRef<typeof TextInput>>(null);
  const email = useRef<ComponentRef<typeof TextInput>>(null);
  const [values, setValues] = useState({ name: "An", email: "ana" });
  const [submitted, setSubmitted] = useState(presetErrors);
  const [submission, setSubmission] = useState(0);
  const errors = submitted ? validate(values) : [];
  const submit = () => {
    setSubmitted(true);
    setSubmission((current) => current + 1);
  };
  return (
    <KeyboardForm contentContainerStyle={{ padding: 16, gap: 20 }} testID="validation-form">
      <Typography.Text accessibilityRole="header" variant="h3">
        Validación sin perder el borrador
      </Typography.Text>
      <Typography.Text>
        Envía este borrador incompleto y toca un error: el primer toque vuelve al campo
        indicado con el teclado abierto. Corrige los datos sin perder lo que escribiste.
      </Typography.Text>
      <ErrorSummary
        errors={errors}
        itemStyle={
          customContent
            ? { backgroundColor: theme.bg.muted, padding: 12, borderRadius: 12 }
            : undefined
        }
        key={submission}
        onSelectError={(id) => {
          if (id === "name") name.current?.focus();
          if (id === "email") email.current?.focus();
        }}
        renderErrorContent={
          customContent
            ? (error, index) => (
                <View style={{ gap: 8 }}>
                  <Typography.Text allowFontScaling numberOfLines={0} semibold>
                    {index + 1}. {error.label}
                  </Typography.Text>
                  <Typography.Text allowFontScaling numberOfLines={0} underline>
                    {error.message}
                  </Typography.Text>
                </View>
              )
            : undefined
        }
        renderHeader={
          customContent
            ? (title) => (
                <Typography.Text allowFontScaling numberOfLines={0} variant="h4">
                  {title}
                </Typography.Text>
              )
            : undefined
        }
        style={customContent ? { borderRadius: 20, gap: 12 } : undefined}
        testID="validation-summary"
      />
      <View style={{ gap: 16 }}>
        <Input
          error={errors.find(({ id }) => id === "name")?.message}
          label="Nombre completo"
          onChangeText={(text) => setValues((current) => ({ ...current, name: text }))}
          onSubmitEditing={() => email.current?.focus()}
          ref={name}
          returnKeyType="next"
          submitBehavior="submit"
          testID="validation-name"
          value={values.name}
        />
        <Input
          autoCapitalize="none"
          error={errors.find(({ id }) => id === "email")?.message}
          keyboardType="email-address"
          label="Correo electrónico"
          onChangeText={(text) => setValues((current) => ({ ...current, email: text }))}
          onSubmitEditing={submit}
          ref={email}
          returnKeyType="done"
          submitBehavior="submit"
          testID="validation-email"
          value={values.email}
        />
      </View>
      <Button onPress={submit} testID="validation-submit" title="Enviar borrador" />
      {submitted && errors.length === 0 ? (
        <Typography.Text accessibilityLiveRegion="polite">
          Formulario válido. La demostración conserva tu borrador.
        </Typography.Text>
      ) : null}
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Los mensajes del resumen son los mismos que aparecen junto a los campos. Cada nuevo
        envío vuelve a anunciar los errores; editar no mueve el foco.
      </Typography.Text>
      {customContent ? (
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          Los slots reemplazan el contenido visual, no los nombres, las áreas táctiles ni el
          foco. El contenido personalizado debe permitir texto multilínea, escalado de fuente
          y no añadir controles interactivos dentro de los enlaces.
        </Typography.Text>
      ) : null}
    </KeyboardForm>
  );
}

export const InvalidSubmission: Story = { render: () => <ValidationForm /> };
export const CustomContent: Story = { render: () => <ValidationForm customContent /> };
export const PresetErrors: Story = { render: () => <ValidationForm presetErrors /> };
export const PresetCustomContent: Story = {
  render: () => <ValidationForm customContent presetErrors />,
};
