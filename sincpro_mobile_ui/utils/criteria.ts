export type CriteriaValue = string | number | boolean;
export interface CriteriaOperator {
  id: string;
  label: string;
  arity: "none" | "one" | "range";
}
export interface CriteriaField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "choice";
  operators: readonly CriteriaOperator[];
  options?: readonly { label: string; value: CriteriaValue }[];
}
export interface CriteriaCondition {
  kind: "condition";
  field: string;
  operator: string;
  values: readonly CriteriaValue[];
}
export interface CriteriaGroup {
  kind: "group";
  join: "all" | "any" | "none";
  children: readonly CriteriaNode[];
}
export type CriteriaNode = CriteriaCondition | CriteriaGroup;
export interface CollectionSort {
  field: string;
  direction: "asc" | "desc";
}
export interface CollectionQuery {
  search: string;
  filter: CriteriaGroup;
  sort: readonly CollectionSort[];
  groupBy: readonly string[];
}
export interface CollectionField {
  id: string;
  label: string;
  ascLabel?: string;
  descLabel?: string;
}
export interface SavedCollectionQuery {
  id: string;
  label: string;
  query: CollectionQuery;
}

export function parseCriteriaDate(value: CriteriaValue | undefined): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    return null;
  return new Date(`${value}T12:00:00`);
}

export function criteriaAt(root: CriteriaNode, path: readonly number[]): CriteriaNode {
  let node = root;
  for (const index of path) {
    if (node.kind !== "group" || !node.children[index])
      throw new Error("Invalid criteria path");
    node = node.children[index];
  }
  return node;
}

export function replaceCriteria(
  root: CriteriaGroup,
  path: readonly number[],
  replacement: CriteriaNode | null,
): CriteriaGroup {
  if (path.length === 0) {
    if (replacement?.kind !== "group") throw new Error("Criteria root must remain a group");
    return replacement;
  }
  const [index, ...rest] = path;
  const child = root.children[index];
  if (!child) throw new Error("Invalid criteria path");
  if (rest.length && child.kind !== "group") throw new Error("Invalid criteria path");
  const next =
    rest.length && child.kind === "group"
      ? replaceCriteria(child, rest, replacement)
      : replacement;
  return {
    ...root,
    children: root.children.flatMap((item, position) =>
      position !== index ? [item] : next ? [next] : [],
    ),
  };
}

export function describeCriteria(
  node: CriteriaNode,
  fields: readonly CriteriaField[],
): string {
  if (node.kind === "group") {
    if (!node.children.length) return "Sin condiciones";
    const join = { all: "Todas", any: "Cualquiera", none: "Ninguna" }[node.join];
    return `${join}: (${node.children.map((child) => describeCriteria(child, fields)).join("; ")})`;
  }
  const field = fields.find((item) => item.id === node.field);
  const operator = field?.operators.find((item) => item.id === node.operator);
  const values = node.values.map(
    (value) =>
      field?.options?.find((option) => option.value === value)?.label ?? String(value),
  );
  return `${field?.label ?? node.field} ${operator?.label ?? node.operator}${values.length ? ` ${values.join(" — ")}` : ""}`;
}

export function validateCondition(
  condition: CriteriaCondition,
  fields: readonly CriteriaField[],
): string | undefined {
  const field = fields.find((item) => item.id === condition.field);
  if (!field) return "El campo ya no está disponible.";
  const operator = field.operators.find((item) => item.id === condition.operator);
  if (!operator) return "El operador no está disponible para este campo.";
  const count = { none: 0, one: 1, range: 2 }[operator.arity];
  if (condition.values.length !== count) return "Completa los valores de la condición.";
  for (const value of condition.values) {
    if (field.type === "number" && (typeof value !== "number" || !Number.isFinite(value)))
      return "Introduce un número válido.";
    if (field.type === "text" && (typeof value !== "string" || !value.trim()))
      return "Introduce un texto.";
    if (field.type === "date" && !parseCriteriaDate(value))
      return "Introduce una fecha válida (AAAA-MM-DD).";
    if (field.type === "choice" && !field.options?.some((option) => option.value === value))
      return "Selecciona un valor disponible.";
  }
  if (
    operator.arity === "range" &&
    field.type === "number" &&
    Number(condition.values[0]) > Number(condition.values[1])
  )
    return "El inicio no puede superar el final.";
  if (
    operator.arity === "range" &&
    field.type === "date" &&
    String(condition.values[0]) > String(condition.values[1])
  )
    return "El inicio no puede superar el final.";
  return undefined;
}

export function validateCriteria(
  group: CriteriaGroup,
  fields: readonly CriteriaField[],
): string | undefined {
  for (const child of group.children) {
    if (child.kind === "group" && !child.children.length)
      return "Completa o elimina el grupo vacío.";
    const error =
      child.kind === "group"
        ? validateCriteria(child, fields)
        : validateCondition(child, fields);
    if (error) return error;
  }
  return undefined;
}

export function moveCollectionEntry<T>(
  items: readonly T[],
  index: number,
  direction: -1 | 1,
): T[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length)
    throw new Error("Invalid collection reorder");
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
