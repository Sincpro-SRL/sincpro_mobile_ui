import type { DocumentRenderer } from "@sincpro/mobile-ui/Display/document-renderer";
import { documentBase64, type DocumentSource } from "@sincpro/mobile-ui/utils/document";
import { Directory, File, Paths } from "expo-file-system";
import PdfThumbnail from "react-native-pdf-thumbnail";

const folder = new Directory(Paths.cache, "storybook-pdf");
const writtenFiles = new Map<string, string>();

async function localPdfUri(source: DocumentSource): Promise<string> {
  const base64 = documentBase64(source);
  if (base64 === undefined && "uri" in source) return source.uri;
  if (base64 === undefined) throw new Error("PDF sin contenido");
  const written = writtenFiles.get(base64);
  if (written) return written;
  folder.create({ idempotent: true });
  const file = new File(folder, `document-${writtenFiles.size + 1}-${Date.now()}.pdf`);
  await file.write(base64, { encoding: "base64" });
  writtenFiles.set(base64, file.uri);
  return file.uri;
}

export const storybookPdfRenderer: DocumentRenderer = {
  label: "PDF",
  render: async (source, { maxWidth, firstPageOnly, signal }) => {
    const uri = await localPdfUri(source);
    signal.throwIfAborted();
    const pages = await PdfThumbnail.generateAllPages(uri, { maxWidth, quality: 90 });
    return { pageCount: pages.length, pages: firstPageOnly ? pages.slice(0, 1) : pages };
  },
};
