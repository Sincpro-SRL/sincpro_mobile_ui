import { Actions } from "@sincpro/mobile-ui/Actions";
import DocumentPreview from "@sincpro/mobile-ui/Display/Display.DocumentPreview";
import DocumentViewer from "@sincpro/mobile-ui/Display/Display.DocumentViewer";
import type { DocumentRenderer } from "@sincpro/mobile-ui/Display/document-renderer";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { DocumentSource } from "@sincpro/mobile-ui/utils/document";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import { FIXTURES, useFixtureBase64, useFixtureUri } from "../fixtures/documents";

const meta: Meta = { title: "Components/Data Display/Document" };
export default meta;
type Story = StoryObj;

interface OpenDocument {
  source: DocumentSource;
  title: string;
}

function useViewer(renderer?: DocumentRenderer) {
  const [document, setDocument] = useState<OpenDocument | null>(null);
  const [visible, setVisible] = useState(false);
  return {
    open: (next: OpenDocument) => {
      setDocument(next);
      setVisible(true);
    },
    viewer: (
      <DocumentViewer
        onClose={() => setVisible(false)}
        renderer={renderer}
        source={document?.source ?? null}
        title={document?.title}
        visible={visible}
      />
    ),
  };
}

function Pending({ height = 180 }: { height?: number }) {
  return <Skeleton height={height + 58} radius={12} width="100%" />;
}

export const FileOrBase64: Story = {
  render: function FileOrBase64() {
    const reportUri = useFixtureUri(FIXTURES.reportPdf);
    const receiptPng = useFixtureBase64(FIXTURES.receiptPng);
    const receiptPdf = useFixtureBase64(FIXTURES.receiptPdf);
    const { open, viewer } = useViewer();

    return (
      <View className="gap-4">
        <Typography.Text>
          La misma API recibe un archivo ({"{ uri }"}) o el contenido en base64 (
          {"{ base64 }"}). El tipo se detecta solo: PNG, JPEG o PDF. Toca una tarjeta para
          abrir el visor.
        </Typography.Text>

        <Typography.Text semibold>PDF desde archivo · A4, 3 páginas</Typography.Text>
        {reportUri ? (
          <DocumentPreview
            onPress={() =>
              open({ source: { uri: reportUri }, title: "Reporte de impresiones" })
            }
            source={{ uri: reportUri }}
            title="Reporte de impresiones"
          />
        ) : (
          <Pending />
        )}

        <Typography.Text semibold>Imagen en base64 · captura de impresión</Typography.Text>
        {receiptPng ? (
          <DocumentPreview
            onPress={() =>
              open({ source: { base64: receiptPng }, title: "Comprobante 000123" })
            }
            source={{ base64: receiptPng }}
            title="Comprobante 000123"
          />
        ) : (
          <Pending />
        )}

        <Typography.Text semibold>PDF en base64 · recibo térmico 72 mm</Typography.Text>
        {receiptPdf ? (
          <DocumentPreview
            onPress={() =>
              open({ source: { base64: receiptPdf }, title: "Comprobante 000123" })
            }
            source={{ base64: receiptPdf }}
            title="Comprobante 000123"
          />
        ) : (
          <Pending />
        )}

        {viewer}
      </View>
    );
  },
};

interface PrintJob {
  id: string;
  title: string;
  reason: string;
  fixture: "png" | "pdf";
}

const FAILED_JOBS: PrintJob[] = [
  {
    id: "000123",
    title: "Comprobante 000123",
    reason: "Impresora desconectada · hace 2 min",
    fixture: "png",
  },
  {
    id: "000124",
    title: "Comprobante 000124",
    reason: "Sin papel · hace 5 min",
    fixture: "pdf",
  },
];

export const FailedPrintJobs: Story = {
  render: function FailedPrintJobs() {
    const png = useFixtureBase64(FIXTURES.receiptPng);
    const pdf = useFixtureBase64(FIXTURES.receiptPdf);
    const [queued, setQueued] = useState<string[]>([]);
    const { open, viewer } = useViewer();

    return (
      <View className="gap-4">
        <Typography.Text>
          Caso de uso: impresiones que fallaron. Se ve qué se iba a imprimir sin abrir un
          string gigante, y se decide si reintentar.
        </Typography.Text>
        {FAILED_JOBS.map((job) => {
          const base64 = job.fixture === "png" ? png : pdf;
          const isQueued = queued.includes(job.id);
          return (
            <View
              className="gap-3 rounded-2xl border border-border-light bg-bg-card p-3"
              key={job.id}
            >
              <View className="gap-0.5">
                <Typography.Text semibold>{job.title}</Typography.Text>
                <Typography.Text className="text-danger" variant="caption">
                  {isQueued ? "En cola para reimprimir" : job.reason}
                </Typography.Text>
              </View>
              {base64 ? (
                <DocumentPreview
                  height={140}
                  onPress={() => open({ source: { base64 }, title: job.title })}
                  source={{ base64 }}
                  title="Vista previa"
                />
              ) : (
                <Pending height={140} />
              )}
              <Actions.Button
                disabled={isQueued}
                onPress={() => setQueued((previous) => [...previous, job.id])}
                title={isQueued ? "En cola" : "Reintentar impresión"}
                variant="secondary"
              />
            </View>
          );
        })}
        {viewer}
      </View>
    );
  },
};

export const FitAndErrors: Story = {
  render: function FitAndErrors() {
    const receiptPng = useFixtureBase64(FIXTURES.receiptPng);
    const { open, viewer } = useViewer();

    return (
      <View className="gap-4">
        <Typography.Text>
          fit=&quot;top&quot; muestra el encabezado de un recibo largo;
          fit=&quot;contain&quot; muestra la página entera. Un contenido inválido no rompe la
          pantalla: avisa y permite reintentar.
        </Typography.Text>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <Typography.Text variant="caption">fit=&quot;top&quot;</Typography.Text>
            {receiptPng ? (
              <DocumentPreview
                height={200}
                onPress={() => open({ source: { base64: receiptPng }, title: "Comprobante" })}
                source={{ base64: receiptPng }}
                title="Comprobante"
              />
            ) : (
              <Pending height={200} />
            )}
          </View>
          <View className="flex-1 gap-2">
            <Typography.Text variant="caption">fit=&quot;contain&quot;</Typography.Text>
            {receiptPng ? (
              <DocumentPreview
                fit="contain"
                height={200}
                onPress={() => open({ source: { base64: receiptPng }, title: "Comprobante" })}
                source={{ base64: receiptPng }}
                title="Comprobante"
              />
            ) : (
              <Pending height={200} />
            )}
          </View>
        </View>
        <Typography.Text semibold>Imagen corrupta</Typography.Text>
        <DocumentPreview
          height={120}
          source={{ base64: "iVBORw0KGgoAAAA-corrupto", mimeType: "image/png" }}
          title="Captura dañada"
        />
        <Typography.Text semibold>PDF corrupto</Typography.Text>
        <DocumentPreview
          height={120}
          source={{ base64: "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK" }}
          title="Reporte dañado"
        />
        {viewer}
      </View>
    );
  },
};

const RECEIPT_HTML = btoa(
  "<!DOCTYPE html><html><body><h1>Comprobante 000123</h1></body></html>",
);

function useServerRenderer(pageUri: string | null): DocumentRenderer | null {
  const [renderer, setRenderer] = useState<DocumentRenderer | null>(null);
  if (pageUri && !renderer) {
    setRenderer({
      label: "HTML",
      render: (_source, { signal }) =>
        new Promise((resolve, reject) => {
          const timer = setTimeout(
            () =>
              resolve({ pageCount: 1, pages: [{ uri: pageUri, width: 576, height: 1328 }] }),
            1200,
          );
          signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(signal.reason);
          });
        }),
    });
  }
  return renderer;
}

export const CustomRenderer: Story = {
  render: function CustomRenderer() {
    const pageUri = useFixtureUri(FIXTURES.receiptPng);
    const renderer = useServerRenderer(pageUri) ?? undefined;
    const { open, viewer } = useViewer(renderer);
    const source: DocumentSource = { base64: RECEIPT_HTML };

    return (
      <View className="gap-4">
        <Typography.Text>
          Cualquier tipo se previsualiza si alguien le inyecta un renderizador: global con
          registerDocumentRenderers o por componente con la prop renderer. Acá un HTML se
          renderiza en el servidor (1,2 s simulados) y vuelve como imagen.
        </Typography.Text>
        <DocumentPreview
          onPress={() => open({ source, title: "Comprobante HTML" })}
          renderer={renderer}
          source={source}
          title="Comprobante HTML"
        />
        <Typography.Text semibold>El mismo HTML sin renderizador</Typography.Text>
        <DocumentPreview height={120} source={source} title="Comprobante HTML" />
        {viewer}
      </View>
    );
  },
};
