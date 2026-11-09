import type { DocumentPage, DocumentSource } from "@sincpro/mobile-ui/utils/document";

/**
 * The design system shows pages; turning a document into pages is the app's job. Register
 * one renderer per MIME type at startup (`"image/*"` matches every image):
 *
 *   registerDocumentRenderers({
 *     "application/pdf": { label: "PDF", render: renderPdfPages },
 *     "text/html": { label: "HTML", render: renderHtmlPages },
 *   });
 *
 * A component can override it with its `renderer` prop; keep that object stable (module
 * scope), since a new one starts a new render. Images without a renderer load natively;
 * any other type without one shows that the preview is unavailable.
 */
export interface DocumentRenderRequest {
  maxWidth: number;
  firstPageOnly: boolean;
  signal: AbortSignal;
}

export interface DocumentRenderResult {
  pageCount: number;
  pages: DocumentPage[];
}

export interface DocumentRenderer {
  label: string;
  render: (
    source: DocumentSource,
    request: DocumentRenderRequest,
  ) => Promise<DocumentRenderResult>;
}

const renderers = new Map<string, DocumentRenderer>();

export function registerDocumentRenderers(
  entries: Record<string, DocumentRenderer | null>,
): void {
  for (const [mimeType, renderer] of Object.entries(entries)) {
    if (renderer) renderers.set(mimeType.toLowerCase(), renderer);
    else renderers.delete(mimeType.toLowerCase());
  }
}

export function resetDocumentRenderers(): void {
  renderers.clear();
}

export function documentRenderer(mimeType: string | undefined): DocumentRenderer | undefined {
  if (!mimeType) return undefined;
  const type = mimeType.toLowerCase();
  return renderers.get(type) ?? renderers.get(`${type.split("/")[0]}/*`);
}
