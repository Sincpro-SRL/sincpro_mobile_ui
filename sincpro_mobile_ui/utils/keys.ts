export function uniqueKeys<T>(
  items: readonly T[],
  keyExtractor: (item: T, index: number) => string,
  component: string,
): string[] {
  const keys = items.map(keyExtractor);
  if (
    keys.some((key) => typeof key !== "string" || !key.trim()) ||
    new Set(keys).size !== keys.length
  )
    throw new Error(`${component} requires unique, non-empty string keys.`);
  return keys;
}
