import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import KeyboardForm from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt } from "@sincpro/mobile-ui/utils/async";
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
import { useRef, useState } from "react";
import { Keyboard, View } from "react-native";

export interface CollectionOptionsProps {
  visible: boolean;
  value: CollectionQuery;
  fields: readonly CriteriaField[];
  sortFields?: readonly CollectionField[];
  groupFields?: readonly CollectionField[];
  savedQueries?: readonly SavedCollectionQuery[];
  onApply: (query: CollectionQuery) => void | Promise<void>;
  onClose: () => void;
  onSave?: (label: string, query: CollectionQuery) => void | Promise<void>;
  title?: string;
  testID?: string;
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
  onPendingChange,
}: CollectionOptionsProps & { onPendingChange: (pending: boolean) => void }) {
  const pending = useRef(false);
  const [draft, setDraft] = useState(value);
  const [section, setSection] = useState<Section>("filter");
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const problem = () =>
    validateCriteria(draft.filter, fields) ??
    (draft.sort.some((sort) => !sortFields.some((field) => field.id === sort.field))
      ? "El orden contiene un campo no disponible."
      : undefined) ??
    (draft.groupBy.some((id) => !groupFields.some((field) => field.id === id))
      ? "El agrupado contiene un campo no disponible."
      : undefined);
  const close = () => {
    if (!pending.current) {
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
  const saveConfiguration = async () => {
    if (!onSave || pending.current) return;
    const invalid = problem();
    if (invalid || !label.trim()) {
      setError(invalid ?? "Escribe un nombre para guardar.");
      return;
    }
    pending.current = true;
    setSaving(true);
    onPendingChange(true);
    setError(undefined);
    setStatus(undefined);
    const result = await attempt(async () => {
      await onSave(label.trim(), draft);
      setStatus("Configuración guardada. Pulsa Aplicar configuración para usarla.");
    });
    pending.current = false;
    setSaving(false);
    onPendingChange(false);
    if (!result.ok) {
      console.error("[CollectionOptions] Save failed", result.error);
      setError("No se pudo guardar. Conservamos la configuración para reintentar.");
    }
  };
  const applyConfiguration = async () => {
    if (editing || pending.current) return;
    const invalid = problem();
    if (invalid) {
      setError(invalid);
      return;
    }
    pending.current = true;
    setSaving(true);
    setApplying(true);
    onPendingChange(true);
    setError(undefined);
    const result = await attempt(async () => {
      await onApply(draft);
      Keyboard.dismiss();
      onClose();
    });
    pending.current = false;
    setSaving(false);
    setApplying(false);
    onPendingChange(false);
    if (!result.ok) {
      console.error("[CollectionOptions] Apply failed", result.error);
      setError("No se pudo aplicar. Conservamos la configuración para reintentar.");
    }
  };
  return (
    <View style={{ flex: 1, minHeight: 0 }}>
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
              variant="bodySmall"
            >
              {item.label}
            </Typography.Text>
          </Pressable>
        ))}
      </View>
      <View
        importantForAccessibility={saving ? "no-hide-descendants" : "auto"}
        pointerEvents={saving ? "none" : "auto"}
        style={{ flex: 1, minHeight: 0 }}
      >
        <KeyboardForm contentContainerStyle={{ paddingVertical: 16, gap: 16 }}>
          {!editing ? (
            <Typography.Text className="text-text-secondary" variant="bodySmall">
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
              <Typography.Text variant="body">
                Una configuración incluye búsqueda, condiciones, orden y niveles de
                agrupación. Cargarla todavía no modifica la colección.
              </Typography.Text>
              {!savedQueries.length ? (
                <Typography.Text>No hay configuraciones guardadas.</Typography.Text>
              ) : (
                savedQueries.map((saved) => (
                  <Actions.Button
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
                    editable={!saving}
                    label="Nombre de la configuración"
                    onChangeText={setLabel}
                    testID="collection-query-name"
                    value={label}
                  />
                  <Actions.Button
                    loading={saving}
                    onPress={() => void saveConfiguration()}
                    title="Guardar configuración"
                  />
                </>
              ) : null}
            </>
          ) : (
            <>
              <Typography.Text variant="body">
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
                    <Typography.Text semibold variant="body">
                      {index + 1}. {field?.label ?? `${id} (no disponible)`}
                    </Typography.Text>
                    {section === "sort" ? (
                      <Actions.Button
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
                      <Actions.Button
                        accessibilityLabel={`Subir ${field?.label ?? id}`}
                        disabled={index === 0}
                        onPress={() => updateOrder(moveCollectionEntry(ordered, index, -1))}
                        title="Subir"
                        variant="link"
                      />
                      <Actions.Button
                        accessibilityLabel={`Bajar ${field?.label ?? id}`}
                        disabled={index === ordered.length - 1}
                        onPress={() => updateOrder(moveCollectionEntry(ordered, index, 1))}
                        title="Bajar"
                        variant="link"
                      />
                      <Actions.Button
                        accessibilityLabel={`Quitar ${field?.label ?? id}`}
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
        </KeyboardForm>
      </View>
      {error ? (
        <Typography.Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="pb-3 text-danger"
          selectable
        >
          {error}
        </Typography.Text>
      ) : null}
      <View className="py-3 border-t border-border-light gap-2">
        {editing ? (
          <Typography.Text>Guarda o cancela la condición antes de aplicar.</Typography.Text>
        ) : null}
        <Actions.Button
          accessibilityLabel="Cancelar configuración"
          disabled={saving}
          onPress={close}
          title="Cancelar"
          variant="secondary"
        />
        <Actions.Button
          disabled={editing || saving}
          loading={applying}
          onPress={() => void applyConfiguration()}
          title="Aplicar configuración"
        />
      </View>
    </View>
  );
}

export default function CollectionOptions(props: CollectionOptionsProps) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  return (
    <Sheet
      dismissible={!pending}
      onClose={() => {
        if (!busy.current) {
          Keyboard.dismiss();
          props.onClose();
        }
      }}
      scrollable={false}
      testID={props.testID}
      title={props.title ?? "Configurar colección"}
      visible={props.visible}
    >
      {props.visible ? (
        <OptionsEditor
          {...props}
          onPendingChange={(next) => {
            busy.current = next;
            setPending(next);
          }}
        />
      ) : null}
    </Sheet>
  );
}
