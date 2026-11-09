import {
  type DocumentRenderer,
  documentRenderer,
} from "@sincpro/mobile-ui/Display/document-renderer";
import {
  documentImageUri,
  documentMimeType,
  type DocumentPage,
  type DocumentSource,
  isImageMimeType,
  mimeTypeLabel,
} from "@sincpro/mobile-ui/utils/document";
import { useEffect, useState } from "react";

export enum DocumentStatus {
  LOADING = "loading",
  READY = "ready",
  UNSUPPORTED = "unsupported",
  ERROR = "error",
}

export interface DocumentPagesState {
  label: string;
  isImage: boolean;
  status: DocumentStatus;
  pageCount: number;
  pages: DocumentPage[];
  attempt: number;
  retry: () => void;
  reportPageError: () => void;
}

interface Attempt {
  value: string;
  attempt: number;
}

interface Rendered extends Attempt {
  renderer: DocumentRenderer;
  isUri: boolean;
  mimeType: string | undefined;
  maxWidth: number;
  firstPageOnly: boolean;
  failed: boolean;
  pageCount: number;
  pages: DocumentPage[];
}

export function documentMeta(label: string, isImage: boolean, pageCount: number): string {
  if (isImage || pageCount === 0) return label;
  return `${label} · ${pageCount} ${pageCount === 1 ? "página" : "páginas"}`;
}

export function documentHeading(state: DocumentPagesState): string {
  return state.isImage ? state.label : `Documento ${state.label}`;
}

export function useDocumentPages(
  source: DocumentSource,
  maxWidth: number,
  firstPageOnly: boolean,
  override?: DocumentRenderer,
): DocumentPagesState {
  const detected = documentMimeType(source);
  const renderer = override ?? documentRenderer(detected);
  const isImage = !renderer && isImageMimeType(detected);
  const label = renderer?.label ?? mimeTypeLabel(detected);
  const isUri = "uri" in source;
  const value = isUri ? source.uri : source.base64;
  const { mimeType } = source;
  const [attempt, setAttempt] = useState(0);
  const [rendered, setRendered] = useState<Rendered | null>(null);
  const [pageFailure, setPageFailure] = useState<Attempt | null>(null);

  useEffect(() => {
    if (!renderer) return;
    const controller = new AbortController();
    const target: DocumentSource = isUri
      ? { uri: value, mimeType }
      : { base64: value, mimeType };
    const request = { renderer, value, isUri, mimeType, maxWidth, firstPageOnly, attempt };
    renderer.render(target, { maxWidth, firstPageOnly, signal: controller.signal }).then(
      (result) => {
        if (!controller.signal.aborted) setRendered({ ...request, failed: false, ...result });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(`[Document] ${renderer.label} preview failed`, error);
        setRendered({ ...request, failed: true, pageCount: 0, pages: [] });
      },
    );
    return () => controller.abort();
  }, [renderer, isUri, value, mimeType, maxWidth, firstPageOnly, attempt]);

  const base = {
    label,
    isImage,
    attempt,
    retry: () => setAttempt((previous) => previous + 1),
    reportPageError: () => setPageFailure({ value, attempt }),
  };
  const empty = { ...base, pageCount: 0, pages: [] };
  const pageFailed = pageFailure?.value === value && pageFailure.attempt === attempt;
  if (pageFailed) return { ...empty, status: DocumentStatus.ERROR };

  if (isImage) {
    return {
      ...base,
      status: DocumentStatus.READY,
      pageCount: 1,
      pages: [{ uri: documentImageUri(source) }],
    };
  }
  if (!renderer) return { ...empty, status: DocumentStatus.UNSUPPORTED };

  const current =
    rendered?.renderer === renderer &&
    rendered.value === value &&
    rendered.isUri === isUri &&
    rendered.mimeType === mimeType &&
    rendered.maxWidth === maxWidth &&
    rendered.firstPageOnly === firstPageOnly &&
    rendered.attempt === attempt
      ? rendered
      : null;
  if (!current) return { ...empty, status: DocumentStatus.LOADING };
  if (current.failed) return { ...empty, status: DocumentStatus.ERROR };
  return {
    ...base,
    status: DocumentStatus.READY,
    pageCount: current.pageCount,
    pages: current.pages,
  };
}
