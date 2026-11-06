import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import {
  type CollectionField,
  type CollectionQuery,
  type CriteriaField,
  describeCriteria,
  moveCollectionEntry,
  type SavedCollectionQuery,
  validateCriteria,
} from "@sincpro/mobile-ui/utils/criteria";
import FilterBuilder from "@sincpro/mobile-ui/widgets/FilterBuilder";
import QueryChoice from "@sincpro/mobile-ui/widgets/QueryChoice";
import { vars } from "nativewind";
import { useState } from "react";
import { Keyboard, Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CollectionOptionsProps {
  visible: boolean;
  value: CollectionQuery;
  fields: readonly CriteriaField[];
  sortFields?: readonly CollectionField[];
  groupFields?: readonly CollectionField[];
  savedQueries?: readonly SavedCollectionQuery[];
  onApply: (query: CollectionQuery) => void;
  onClose: () => void;
  onSave?: (label: string, query: CollectionQuery) => void | Promise<void>;
  title?: string;
  testID?: string;
}

export default function CollectionOptions(props: CollectionOptionsProps) {
  return props.visible ? <OptionsEditor {...props} /> : null;
}

const sections = [
  { id: "filter", label: "Filtros" },
  { id: "sort", label: "Ordenar" },
  { id: "group", label: "Agrupar" },
  { id: "saved", label: "Guardados" },
] as const;
type Section = (typeof sections)[number]["id"];

function OptionsEditor({
  value,
  fields,
  sortFields = [],
  groupFields = [],
  savedQueries = [],
  onApply,
  onClose,
  onSave,
  title = "Configurar colección",
  testID,
}: CollectionOptionsProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);
  const [section, setSection] = useState<Section>("filter");
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [saving, setSaving] = useState(false);
  const problem = () =>
    validateCriteria(draft.filter, fields) ??
    (draft.sort.some((sort) => !sortFields.some((field) => field.id === sort.field))
      ? "El orden contiene un campo no disponible."
      : undefined) ??
    (draft.groupBy.some((id) => !groupFields.some((field) => field.id === id))
      ? "El agrupado contiene un campo no disponible."
      : undefined);
  const close = () => {
    if (!saving) {
      Keyboard.dismiss();
      onClose();
    }
  };
  const ordered = section === "sort" ? draft.sort.map((entry) => entry.field) : draft.groupBy;
  const available = section === "sort" ? sortFields : groupFields;
  const updateOrder = (next: readonly string[]) =>
    setDraft((current) =>
      section === "sort"
        ? {
            ...current,
            sort: next.map(
              (field) =>
                current.sort.find((entry) => entry.field === field) ?? {
                  field,
                  direction: "asc",
                },
            ),
          }
        : { ...current, groupBy: next },
    );
  return (
    <Modal
      animationType="slide"
      onRequestClose={close}
      presentationStyle="fullScreen"
      visible
    >
      <View
        accessibilityViewIsModal
        onAccessibilityEscape={close}
        style={[
          vars(themeToVars(theme)),
          {
            flex: 1,
            backgroundColor: theme.bg.page,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        testID={testID}
      >
        <View className="flex-row items-center justify-between gap-3 px-4">
          <Typography.Text
            accessibilityRole="header"
            semibold
            style={{ flex: 1, minWidth: 0 }}
            variant="bodyReadable"
          >
            {title}
          </Typography.Text>
          <IconButton
            accessibilityLabel="Cancelar configuración"
            accessibleSizing
            disabled={saving}
            icon="close"
            onPress={close}
          />
        </View>
        <View accessibilityRole="tablist" className="flex-row flex-wrap px-4 gap-2">
          {sections.map((item) => (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="tab"
              accessibilityState={{
                selected: item.id === section,
                disabled: editing || saving,
              }}
              disabled={editing || saving}
              key={item.id}
              onPress={() => {
                Keyboard.dismiss();
                setSection(item.id);
                setError(undefined);
                setStatus(undefined);
              }}
              style={{ minHeight: 48, justifyContent: "center", paddingHorizontal: 8 }}
            >
              <Typography.Text
                className={section === item.id ? "text-text-accent" : "text-text-secondary"}
                semibold={section === item.id}
                variant="bodyLarge"
              >
                {item.label}
              </Typography.Text>
            </Pressable>
          ))}
        </View>
        <KeyboardForm contentContainerStyle={{ padding: 16, gap: 16 }}>
          {!editing ? (
            <Typography.Text className="text-text-secondary" variant="bodyLarge">
              {describeCriteria(draft.filter, fields)}
            </Typography.Text>
          ) : null}
          {section === "filter" ? (
            <FilterBuilder
              fields={fields}
              onChange={(filter) => {
                setError(undefined);
                setDraft({ ...draft, filter });
              }}
              onEditingChange={setEditing}
              value={draft.filter}
            />
          ) : section === "saved" ? (
            <>
              <Typography.Text variant="bodyReadable">
                Una configuración incluye búsqueda, condiciones, orden y niveles de
                agrupación. Cargarla todavía no modifica la colección.
              </Typography.Text>
              {!savedQueries.length ? (
                <Typography.Text>No hay configuraciones guardadas.</Typography.Text>
              ) : (
                savedQueries.map((saved) => (
                  <Button
                    accessibleSizing
                    disabled={saving}
                    key={saved.id}
                    onPress={() => {
                      setDraft(saved.query);
                      setError(undefined);
                      setStatus(
                        `Configuración ${saved.label} cargada. Pulsa Aplicar configuración.`,
                      );
                    }}
                    title={`Cargar ${saved.label}`}
                    variant="secondary"
                  />
                ))
              )}
              {onSave ? (
                <>
                  <Input
                    accessibleSizing
                    editable={!saving}
                    label="Nombre de la configuración"
                    onChangeText={setLabel}
                    testID="collection-query-name"
                    value={label}
                  />
                  <Button
                    accessibleSizing
                    loading={saving}
                    onPress={() => {
                      const invalid = problem();
                      if (invalid || !label.trim()) {
                        setError(invalid ?? "Escribe un nombre para guardar.");
                        return;
                      }
                      setError(undefined);
                      setStatus(undefined);
                      setSaving(true);
                      Promise.resolve()
                        .then(() => onSave(label.trim(), draft))
                        .then(
                          () => {
                            setStatus(
                              "Configuración guardada. Pulsa Aplicar configuración para usarla.",
                            );
                          },
                          (cause: unknown) => {
                            console.error("[CollectionOptions] Save failed", cause);
                            setError(
                              "No se pudo guardar. Conservamos la configuración para reintentar.",
                            );
                          },
                        )
                        .finally(() => setSaving(false));
                    }}
                    title="Guardar configuración"
                  />
                </>
              ) : null}
            </>
          ) : (
            <>
              <Typography.Text variant="bodyReadable">
                {section === "sort"
                  ? "El primer campo tiene prioridad; los siguientes resuelven empates."
                  : "Los grupos se anidan en este orden. La app aplica los niveles al conjunto completo."}
              </Typography.Text>
              {!ordered.length ? (
                <Typography.Text>
                  {section === "sort" ? "Sin orden configurado." : "Sin agrupación."}
                </Typography.Text>
              ) : null}
              {ordered.map((id, index) => {
                const field = available.find((item) => item.id === id);
                const sort = draft.sort.find((entry) => entry.field === id);
                return (
                  <View className="gap-2 border-b border-border-light pb-3" key={id}>
                    <Typography.Text semibold variant="bodyReadable">
                      {index + 1}. {field?.label ?? `${id} (no disponible)`}
                    </Typography.Text>
                    {section === "sort" ? (
                      <Button
                        accessibleSizing
                        onPress={() =>
                          setDraft({
                            ...draft,
                            sort: draft.sort.map((entry) =>
                              entry.field === id
                                ? {
                                    ...entry,
                                    direction: entry.direction === "asc" ? "desc" : "asc",
                                  }
                                : entry,
                            ),
                          })
                        }
                        title={`${field?.label ?? id}: ${sort?.direction === "asc" ? (field?.ascLabel ?? "Ascendente") : (field?.descLabel ?? "Descendente")}`}
                        variant="secondary"
                      />
                    ) : null}
                    <View className="flex-row flex-wrap gap-2">
                      <Button
                        accessibilityLabel={`Subir ${field?.label ?? id}`}
                        accessibleSizing
                        disabled={index === 0}
                        onPress={() => updateOrder(moveCollectionEntry(ordered, index, -1))}
                        title="Subir"
                        variant="link"
                      />
                      <Button
                        accessibilityLabel={`Bajar ${field?.label ?? id}`}
                        accessibleSizing
                        disabled={index === ordered.length - 1}
                        onPress={() => updateOrder(moveCollectionEntry(ordered, index, 1))}
                        title="Bajar"
                        variant="link"
                      />
                      <Button
                        accessibilityLabel={`Quitar ${field?.label ?? id}`}
                        accessibleSizing
                        onPress={() => updateOrder(ordered.filter((key) => key !== id))}
                        title="Quitar"
                        variant="link"
                      />
                    </View>
                  </View>
                );
              })}
              {available.some((field) => !ordered.includes(field.id)) ? (
                <QueryChoice
                  label={
                    section === "sort"
                      ? "Añadir criterio de orden"
                      : "Añadir nivel de agrupación"
                  }
                  onChange={(id) => updateOrder([...ordered, id])}
                  options={available
                    .filter((field) => !ordered.includes(field.id))
                    .map((field) => ({ label: field.label, value: field.id }))}
                  value={undefined}
                />
              ) : null}
            </>
          )}
          {status ? (
            <Typography.Text accessibilityLiveRegion="polite">{status}</Typography.Text>
          ) : null}
          {error ? (
            <Typography.Text accessibilityLiveRegion="polite" className="text-danger">
              {error}
            </Typography.Text>
          ) : null}
        </KeyboardForm>
        <View className="px-4 py-3 border-t border-border-light gap-2">
          {editing ? (
            <Typography.Text>Guarda o cancela la condición antes de aplicar.</Typography.Text>
          ) : null}
          <Button
            accessibleSizing
            disabled={editing || saving}
            onPress={() => {
              const invalid = problem();
              if (invalid) {
                setError(invalid);
                return;
              }
              Keyboard.dismiss();
              onApply(draft);
            }}
            title="Aplicar configuración"
          />
        </View>
      </View>
    </Modal>
  );
}
