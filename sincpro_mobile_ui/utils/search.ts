/** Lowercase, no accents, single spaces: "  Páez  Núñez " -> "paez nunez". */
export function searchKey(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** True when every word of the query appears in some field, ignoring accents and case. */
export function matchesSearch(
  query: string,
  ...fields: (string | null | undefined)[]
): boolean {
  const words = searchKey(query).split(" ").filter(Boolean);
  if (!words.length) return true;
  const haystack = searchKey(fields.filter(Boolean).join(" "));
  return words.every((word) => haystack.includes(word));
}
