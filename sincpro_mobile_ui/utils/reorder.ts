export function reorderKeys<T>(
  items: readonly T[],
  keyExtractor: (item: T) => string,
): string[] {
  const keys = items.map(keyExtractor);
  if (
    keys.some((key) => typeof key !== "string" || !key.trim()) ||
    new Set(keys).size !== keys.length
  )
    throw new Error("ReorderableList requires unique, non-empty string keys.");
  return keys;
}

export function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((key, index) => key === right[index]);
}

export function moveReorderItem<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    !Number.isInteger(fromIndex) ||
    !Number.isInteger(toIndex) ||
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length
  )
    throw new Error("ReorderableList received an invalid move.");
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function applyReorder<T>(
  items: readonly T[],
  keyExtractor: (item: T) => string,
  order: readonly string[],
): T[] {
  const keys = reorderKeys(items, keyExtractor);
  const indices = new Map(keys.map((key, index) => [key, index]));
  if (
    order.length !== keys.length ||
    new Set(order).size !== order.length ||
    order.some((key) => !indices.has(key))
  )
    throw new Error(
      "ReorderableList received an order that does not match the current items.",
    );
  return order.map((key) => items[indices.get(key)!]);
}
