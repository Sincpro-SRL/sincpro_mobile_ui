export type DocumentSource =
  { uri: string; mimeType?: string } | { base64: string; mimeType?: string };

export interface DocumentPage {
  uri: string;
  width?: number;
  height?: number;
}

const DATA_URI_PREFIX = /^data:([^;,]*)[^,]*,/;
const BASE64_SIGNATURES: readonly (readonly [string, string])[] = [
  ["JVBER", "application/pdf"],
  ["iVBORw0KGgo", "image/png"],
  ["/9j/", "image/jpeg"],
  ["R0lGOD", "image/gif"],
  ["UklGR", "image/webp"],
  ["PCFET0NUWVBF", "text/html"],
  ["PCFkb2N0eXBl", "text/html"],
  ["PGh0bWw", "text/html"],
];
const FILE_EXTENSIONS: Record<string, string> = {
  pdf: "application/pdf",
  html: "text/html",
  htm: "text/html",
};
const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "text/html": "HTML",
};

function dataUriMimeType(value: string): string | undefined {
  return DATA_URI_PREFIX.exec(value)?.[1] || undefined;
}

export function stripDataUri(value: string): string {
  const prefix = DATA_URI_PREFIX.exec(value);
  return prefix ? value.slice(prefix[0].length) : value;
}

export function documentMimeType(source: DocumentSource): string | undefined {
  if (source.mimeType) return source.mimeType;
  if ("uri" in source) {
    const extension = /\.([a-z0-9]+)($|[?#])/i.exec(source.uri)?.[1]?.toLowerCase();
    return (
      dataUriMimeType(source.uri) ?? (extension ? FILE_EXTENSIONS[extension] : undefined)
    );
  }
  const declared = dataUriMimeType(source.base64);
  if (declared) return declared;
  const payload = source.base64.trimStart();
  return BASE64_SIGNATURES.find(([signature]) => payload.startsWith(signature))?.[1];
}

export function isImageMimeType(mimeType: string | undefined): boolean {
  return !mimeType || mimeType.toLowerCase().startsWith("image/");
}

export function mimeTypeLabel(mimeType: string | undefined): string {
  if (isImageMimeType(mimeType)) return "Imagen";
  const type = mimeType!.toLowerCase();
  return MIME_LABELS[type] ?? type.split("/").pop()!.toUpperCase();
}

export function documentBase64(source: DocumentSource): string | undefined {
  if ("base64" in source) return stripDataUri(source.base64).trim();
  return source.uri.startsWith("data:") ? stripDataUri(source.uri) : undefined;
}

export function documentImageUri(source: DocumentSource): string {
  if ("uri" in source) return source.uri;
  if (source.base64.startsWith("data:")) return source.base64;
  return `data:${documentMimeType(source) ?? "image/png"};base64,${source.base64.trim()}`;
}
