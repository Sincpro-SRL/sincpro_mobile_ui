import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import ListGroup from "@sincpro/mobile-ui/Display/Display.ListGroup";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import SearchBar from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import { Typography } from "@sincpro/mobile-ui/Typography";
import {
  type CollectionQuery,
  type CriteriaField,
  type CriteriaNode,
  describeCriteria,
  type SavedCollectionQuery,
} from "@sincpro/mobile-ui/utils/criteria";
import CollectionOptions from "@sincpro/mobile-ui/widgets/CollectionOptions";
import FilterBuilder from "@sincpro/mobile-ui/widgets/FilterBuilder";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/Collections/Query configuration",
  excludeStories: ["QueryCollection", "queryFields", "initialQuery"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const queryFields: readonly CriteriaField[] = [
  {
    id: "title",
    label: "Título",
    type: "text",
    operators: [
      { id: "contains", label: "contiene", arity: "one" },
      { id: "equal", label: "es", arity: "one" },
      { id: "empty", label: "está vacío", arity: "none" },
    ],
  },
  {
    id: "amount",
    label: "Importe",
    type: "number",
    operators: [
      { id: "greater", label: "mayor que", arity: "one" },
      { id: "between", label: "entre", arity: "range" },
    ],
  },
  {
    id: "status",
    label: "Estado",
    type: "choice",
    options: [
      { label: "Pendiente", value: "pending" },
      { label: "Completado", value: "done" },
    ],
    operators: [{ id: "equal", label: "es", arity: "one" }],
  },
];
const collectionFields = [
  { id: "title", label: "Título", ascLabel: "A a Z", descLabel: "Z a A" },
  { id: "amount", label: "Importe", ascLabel: "Menor a mayor", descLabel: "Mayor a menor" },
];
const groupFields = [
  { id: "status", label: "Estado" },
  { id: "region", label: "Región" },
];
export const initialQuery: CollectionQuery = {
  search: "",
  filter: { kind: "group", join: "all", children: [] },
  sort: [],
  groupBy: [],
};
const records = [
  { id: "1", title: "Guía de inicio", amount: 80, status: "pending", region: "Norte" },
  { id: "2", title: "Referencia visual", amount: 120, status: "done", region: "Sur" },
  { id: "3", title: "Notas del equipo", amount: 30, status: "pending", region: "Sur" },
] as const;
type RecordItem = (typeof records)[number];
const statusLabel = (value: string) => (value === "pending" ? "Pendiente" : "Completado");

function matches(record: RecordItem, node: CriteriaNode): boolean {
  if (node.kind === "group") {
    if (!node.children.length) return true;
    const results = node.children.map((child) => matches(record, child));
    return node.join === "all"
      ? results.every(Boolean)
      : node.join === "any"
        ? results.some(Boolean)
        : !results.some(Boolean);
  }
  const value =
    node.field === "title"
      ? record.title
      : node.field === "amount"
        ? record.amount
        : record.status;
  switch (node.operator) {
    case "contains":
      return String(value)
        .toLocaleLowerCase()
        .includes(String(node.values[0]).toLocaleLowerCase());
    case "equal":
      return value === node.values[0];
    case "empty":
      return String(value).length === 0;
    case "greater":
      return Number(value) > Number(node.values[0]);
    case "between":
      return (
        Number(value) >= Number(node.values[0]) && Number(value) <= Number(node.values[1])
      );
    default:
      throw new Error(`Unsupported demo operator: ${node.operator}`);
  }
}

function ResultGroups({
  items,
  levels,
  depth = 0,
}: {
  items: readonly RecordItem[];
  levels: readonly string[];
  depth?: number;
}) {
  const field = levels[depth];
  if (!field)
    return (
      <ListGroup surface="plain" title="Recursos">
        {items.map((record) => (
          <ListItem
            key={record.id}
            subtitle={`${statusLabel(record.status)} · ${record.region}`}
            title={record.title}
            value={`${record.amount} Bs`}
            variant="mobile"
          />
        ))}
      </ListGroup>
    );
  const groups = new Map<string, RecordItem[]>();
  for (const record of items) {
    const label = field === "status" ? statusLabel(record.status) : record.region;
    groups.set(label, [...(groups.get(label) ?? []), record]);
  }
  return (
    <View style={{ gap: 16 }}>
      {Array.from(groups, ([label, grouped]) => (
        <View key={label} style={{ gap: 8, paddingLeft: depth ? 16 : 0 }}>
          <Typography.Text accessibilityRole="header" semibold variant="bodyReadable">
            {label} ({grouped.length})
          </Typography.Text>
          <ResultGroups depth={depth + 1} items={grouped} levels={levels} />
        </View>
      ))}
    </View>
  );
}

export function QueryCollection() {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<SavedCollectionQuery[]>([
    {
      id: "pending",
      label: "Pendientes por importe",
      query: {
        ...initialQuery,
        filter: {
          kind: "group",
          join: "all",
          children: [
            { kind: "condition", field: "status", operator: "equal", values: ["pending"] },
          ],
        },
        sort: [{ field: "amount", direction: "desc" }],
        groupBy: ["region"],
      },
    },
  ]);
  const visible = records
    .filter(
      (record) =>
        record.title.toLocaleLowerCase().includes(query.search.toLocaleLowerCase()) &&
        matches(record, query.filter),
    )
    .sort((left, right) => {
      for (const entry of query.sort) {
        const compared =
          entry.field === "amount"
            ? left.amount - right.amount
            : left.title.localeCompare(right.title);
        if (compared) return compared * (entry.direction === "asc" ? 1 : -1);
      }
      return 0;
    });
  const suggestions = records
    .filter(
      (record) =>
        query.search.trim() &&
        record.title.toLocaleLowerCase().includes(query.search.toLocaleLowerCase()),
    )
    .map((record) => ({
      id: record.id,
      label: record.title,
      description: "Buscar este título",
    }));
  return (
    <View style={{ gap: 20 }}>
      <Typography.Heading variant="h3">Colección configurable</Typography.Heading>
      <SearchBar
        accessibilityLabel="Buscar en la colección"
        accessibleSizing
        clearAccessibilityLabel="Limpiar búsqueda de colección"
        onChangeText={(search) => setQuery({ ...query, search })}
        suggestions={{
          items: suggestions,
          onSelect: (suggestion) => setQuery({ ...query, search: suggestion.label }),
        }}
        testID="query-search"
        value={query.search}
      />
      <Button
        accessibleSizing
        onPress={() => setOpen(true)}
        title="Filtros, orden y agrupación"
        variant="secondary"
      />
      <Typography.Text accessibilityLiveRegion="polite" variant="bodyReadable">
        {visible.length} {visible.length === 1 ? "resultado" : "resultados"}
      </Typography.Text>
      <Typography.Text className="text-text-secondary">
        {describeCriteria(query.filter, queryFields)}
      </Typography.Text>
      {query.sort.length ? (
        <Typography.Text>
          Orden:{" "}
          {query.sort
            .map(
              (entry) =>
                `${collectionFields.find((field) => field.id === entry.field)?.label} ${entry.direction}`,
            )
            .join(" › ")}
        </Typography.Text>
      ) : null}
      {query.groupBy.length ? (
        <Typography.Text>
          Agrupación:{" "}
          {query.groupBy
            .map((id) => groupFields.find((field) => field.id === id)?.label)
            .join(" › ")}
        </Typography.Text>
      ) : null}
      {!visible.length ? (
        <Button
          accessibleSizing
          onPress={() => setQuery(initialQuery)}
          title="Restablecer colección"
          variant="secondary"
        />
      ) : (
        <ResultGroups items={visible} levels={query.groupBy} />
      )}
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Datos locales completos. Configuraciones guardadas solo durante esta demostración; en
        una app la persistencia y el servidor pertenecen al host.
      </Typography.Text>
      <CollectionOptions
        fields={queryFields}
        groupFields={groupFields}
        onApply={(next) => {
          setQuery(next);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onSave={(label, next) =>
          setSaved((current) => [
            ...current.filter((item) => item.label !== label),
            { id: label, label, query: next },
          ])
        }
        savedQueries={saved}
        sortFields={collectionFields}
        value={query}
        visible={open}
      />
    </View>
  );
}
function BuilderExample() {
  const [filter, setFilter] = useState(initialQuery.filter);
  return <FilterBuilder fields={queryFields} onChange={setFilter} value={filter} />;
}
export const CompleteQuery: Story = { render: () => <QueryCollection /> };
export const NestedConditions: Story = { render: () => <BuilderExample /> };
