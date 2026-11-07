import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import DatePicker from "@sincpro/mobile-ui/Form/Form.DatePicker";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { Typography } from "@sincpro/mobile-ui/Typography";
import {
  type CriteriaCondition,
  type CriteriaField,
  type CriteriaGroup,
  type CriteriaNode,
  type CriteriaValue,
  describeCriteria,
  parseCriteriaDate,
  replaceCriteria,
  validateCondition,
} from "@sincpro/mobile-ui/utils/criteria";
import QueryChoice from "@sincpro/mobile-ui/widgets/QueryChoice";
import { useEffect, useState } from "react";
import { View } from "react-native";

export interface FilterBuilderProps {
  fields: readonly CriteriaField[];
  value: CriteriaGroup;
  onChange: (value: CriteriaGroup) => void;
  onEditingChange?: (editing: boolean) => void;
  className?: string;
  testID?: string;
}

export default function FilterBuilder({
  fields,
  value,
  onChange,
  onEditingChange,
  className,
  testID,
}: FilterBuilderProps) {
  const [path, setPath] = useState<number[]>([]);
  const [editing, setEditing] = useState<{
    index: number | null;
    condition: CriteriaCondition;
  } | null>(null);
  const [error, setError] = useState<string>();
  const isEditing = editing !== null;
  useEffect(() => {
    onEditingChange?.(isEditing);
    return () => onEditingChange?.(false);
  }, [isEditing, onEditingChange]);
  let current: CriteriaNode | undefined = value;
  for (const index of path) {
    current = current?.kind === "group" ? current.children[index] : undefined;
  }
  if (current?.kind !== "group")
    return (
      <View className={className} testID={testID}>
        <Typography.Text accessibilityLiveRegion="polite">
          Este grupo ya no está disponible. La configuración cambió.
        </Typography.Text>
        <Button
          onPress={() => {
            setPath([]);
            setEditing(null);
          }}
          title="Volver a condiciones"
          variant="secondary"
        />
      </View>
    );
  const group = current;
  const changeGroup = (next: CriteriaGroup) => onChange(replaceCriteria(value, path, next));
  const condition = editing?.condition;
  const field = fields.find((item) => item.id === condition?.field);
  const operator = field?.operators.find((item) => item.id === condition?.operator);
  const changeCondition = (next: CriteriaCondition) => {
    setError(undefined);
    setEditing((current) => (current ? { ...current, condition: next } : null));
  };
  const addCondition = () => {
    const first = fields.find((item) => item.operators.length);
    if (!first) throw new Error("No configurable filter fields");
    setError(undefined);
    setEditing({
      index: null,
      condition: {
        kind: "condition",
        field: first.id,
        operator: first.operators[0].id,
        values: [],
      },
    });
  };
  return (
    <View className={className} style={{ gap: 16 }} testID={testID}>
      <Typography.Text accessibilityRole="header" semibold variant="bodyReadable">
        {path.length ? `Grupo ${path.map((index) => index + 1).join(" › ")}` : "Condiciones"}
      </Typography.Text>
      {editing && condition ? (
        <>
          <QueryChoice
            label="Campo"
            onChange={(id) => {
              const next = fields.find((item) => item.id === id);
              if (!next?.operators.length) throw new Error("Field has no operators");
              changeCondition({
                ...condition,
                field: id,
                operator: next.operators[0].id,
                values: [],
              });
            }}
            options={fields
              .filter((item) => item.operators.length)
              .map((item) => ({ label: item.label, value: item.id }))}
            value={condition.field}
          />
          <QueryChoice
            label="Comparación"
            onChange={(id) => changeCondition({ ...condition, operator: id, values: [] })}
            options={(field?.operators ?? []).map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={condition.operator}
          />
          {Array.from(
            { length: operator?.arity === "range" ? 2 : operator?.arity === "one" ? 1 : 0 },
            (_, index) => {
              const label =
                operator?.arity === "range" ? (index === 0 ? "Desde" : "Hasta") : "Valor";
              const update = (next: CriteriaValue) => {
                const values = [...condition.values];
                values[index] = next;
                changeCondition({ ...condition, values });
              };
              return field?.type === "choice" ? (
                <QueryChoice
                  key={index}
                  label={label}
                  onChange={update}
                  options={field.options ?? []}
                  value={condition.values[index]}
                />
              ) : field?.type === "date" ? (
                <DatePicker
                  key={index}
                  label={label}
                  onChange={(date) =>
                    update(
                      `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
                    )
                  }
                  value={parseCriteriaDate(condition.values[index])}
                />
              ) : (
                <Input
                  key={index}
                  keyboardType={
                    field?.type === "number" ? "numbers-and-punctuation" : "default"
                  }
                  label={label}
                  onChangeText={update}
                  testID={`criteria-value-${index}`}
                  value={
                    condition.values[index] === undefined ||
                    Number.isNaN(condition.values[index])
                      ? ""
                      : String(condition.values[index])
                  }
                />
              );
            },
          )}
          {error ? (
            <Typography.Text accessibilityLiveRegion="polite" className="text-danger">
              {error}
            </Typography.Text>
          ) : null}
          <Button
            onPress={() => {
              const next = {
                ...condition,
                values:
                  field?.type === "number"
                    ? Array.from(condition.values, (value) =>
                        typeof value === "string" && !value.trim() ? NaN : Number(value),
                      )
                    : condition.values,
              };
              const problem = validateCondition(next, fields);
              if (problem) {
                setError(problem);
                return;
              }
              const children = [...group.children];
              if (editing.index === null) children.push(next);
              else children[editing.index] = next;
              changeGroup({ ...group, children });
              setEditing(null);
            }}
            title="Guardar condición"
          />
          <Button
            onPress={() => setEditing(null)}
            title="Cancelar condición"
            variant="secondary"
          />
        </>
      ) : (
        <>
          {path.length ? (
            <Button
              onPress={() => setPath(path.slice(0, -1))}
              title="Volver al grupo anterior"
              variant="link"
            />
          ) : null}
          <QueryChoice
            label="Coinciden"
            onChange={(join) => changeGroup({ ...group, join })}
            options={[
              { label: "Todas las condiciones", value: "all" },
              { label: "Cualquiera de las condiciones", value: "any" },
              { label: "Ninguna de las condiciones", value: "none" },
            ]}
            value={group.join}
          />
          {!group.children.length ? (
            <Typography.Text className="text-text-secondary">
              Sin condiciones en este grupo.
            </Typography.Text>
          ) : null}
          {group.children.map((child, index) => (
            <View className="border-b border-border-light pb-3 gap-2" key={index}>
              <Typography.Text variant="bodyReadable">
                {describeCriteria(child, fields)}
              </Typography.Text>
              <View className="flex-row flex-wrap gap-2">
                <Button
                  onPress={() =>
                    child.kind === "group"
                      ? setPath([...path, index])
                      : (setError(undefined), setEditing({ index, condition: child }))
                  }
                  title={
                    child.kind === "group"
                      ? `Abrir grupo ${index + 1}`
                      : `Editar condición ${index + 1}`
                  }
                  variant="secondary"
                />
                <Button
                  onPress={() =>
                    changeGroup({
                      ...group,
                      children: group.children.filter((_, position) => position !== index),
                    })
                  }
                  title={`Eliminar ${child.kind === "group" ? "grupo" : "condición"} ${index + 1}`}
                  variant="link"
                />
              </View>
            </View>
          ))}
          <Button
            disabled={!fields.some((item) => item.operators.length)}
            onPress={addCondition}
            title="Añadir condición"
            variant="secondary"
          />
          <Button
            onPress={() => {
              changeGroup({
                ...group,
                children: [...group.children, { kind: "group", join: "any", children: [] }],
              });
              setPath([...path, group.children.length]);
            }}
            title="Añadir grupo"
            variant="secondary"
          />
        </>
      )}
    </View>
  );
}
