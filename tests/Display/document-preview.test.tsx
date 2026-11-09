import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import {
  type DocumentRenderer,
  type DocumentRenderResult,
  registerDocumentRenderers,
  resetDocumentRenderers,
} from "@sincpro/mobile-ui/Display/document-renderer";
import DocumentPreview from "@sincpro/mobile-ui/Display/Display.DocumentPreview";
import DocumentViewer from "@sincpro/mobile-ui/Display/Display.DocumentViewer";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

jest.mock("expo-image", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    Image: (props: object) => React.createElement(View, { ...props, testID: "page-image" }),
  };
});
jest.mock("@sincpro/mobile-ui/Display/Display.Icon", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Spinner", () => () => null);
jest.mock("@sincpro/mobile-ui/Feedback/Feedback.Skeleton", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return () => React.createElement(View, { testID: "preview-loading" });
});
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type Render = DocumentRenderer["render"];

const PNG = "iVBORw0KGgoAAAANSUhEUgAA";
const PDF = "JVBERi0xLjQKJcOkw7zDtsOf";
const HTML = "PCFET0NUWVBFIGh0bWw+";

function deferred() {
  let resolve: (result: DocumentRenderResult) => void = () => {};
  const promise = new Promise<DocumentRenderResult>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function pdfRenderer(render: Render): DocumentRenderer {
  const renderer = { label: "PDF", render };
  registerDocumentRenderers({ "application/pdf": renderer });
  return renderer;
}

beforeEach(() => {
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
});

afterEach(() => {
  resetDocumentRenderers();
  jest.restoreAllMocks();
});

test("a base64 image reaches the native view as a data URI, without a renderer", async () => {
  await render(<DocumentPreview source={{ base64: PNG }} title="Comprobante 000123" />);
  expect(screen.getByTestId("page-image").props.source).toEqual({
    uri: `data:image/png;base64,${PNG}`,
  });
  expect(screen.getByLabelText("Vista previa de Comprobante 000123, Imagen")).toBeTruthy();
});

test("a type without a renderer says the preview is unavailable", async () => {
  await render(<DocumentPreview source={{ base64: PDF }} />);
  expect(screen.getByText("Vista previa no disponible")).toBeTruthy();
  expect(screen.getByLabelText("Vista previa de Documento PDF, PDF")).toBeTruthy();
  expect(screen.queryByTestId("page-image")).toBeNull();
});

test("a PDF thumbnail renders only the first page and shows how many there are", async () => {
  const pending = deferred();
  const render$ = jest.fn<Render>(() => pending.promise);
  pdfRenderer(render$);
  const onPress = jest.fn();
  await render(
    <DocumentPreview
      onPress={onPress}
      source={{ uri: "file:///cache/report.pdf" }}
      title="Reporte"
    />,
  );
  expect(screen.getByTestId("preview-loading")).toBeTruthy();
  expect(render$).toHaveBeenCalledWith(
    { uri: "file:///cache/report.pdf", mimeType: undefined },
    expect.objectContaining({ firstPageOnly: true }),
  );

  await act(async () =>
    pending.resolve({ pageCount: 3, pages: [{ uri: "file:///cache/page-1.jpg" }] }),
  );
  expect(screen.getByTestId("page-image").props.source).toEqual({
    uri: "file:///cache/page-1.jpg",
  });
  await fireEvent.press(screen.getByLabelText("Vista previa de Reporte, PDF · 3 páginas"));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("any MIME type can be injected, globally or for one component", async () => {
  registerDocumentRenderers({
    "text/html": {
      label: "HTML",
      render: async () => ({ pageCount: 1, pages: [{ uri: "file:///html-1.png" }] }),
    },
  });
  const ticket: DocumentRenderer = {
    label: "Ticket",
    render: async () => ({ pageCount: 2, pages: [{ uri: "file:///ticket-1.png" }] }),
  };
  await render(
    <>
      <DocumentPreview source={{ base64: HTML }} />
      <DocumentPreview renderer={ticket} source={{ base64: "G0BA", mimeType: "x/escpos" }} />
    </>,
  );
  expect(await screen.findByLabelText("Vista previa de Documento HTML, HTML · 1 página")).toBeTruthy();
  expect(screen.getByLabelText("Vista previa de Documento Ticket, Ticket · 2 páginas")).toBeTruthy();
});

test("an image/* renderer replaces the native load for every image type", async () => {
  registerDocumentRenderers({
    "image/*": {
      label: "Foto",
      render: async () => ({ pageCount: 1, pages: [{ uri: "file:///small.jpg" }] }),
    },
  });
  await render(<DocumentPreview source={{ base64: PNG }} />);
  expect(await screen.findByLabelText("Vista previa de Documento Foto, Foto · 1 página")).toBeTruthy();
  expect(screen.getByTestId("page-image").props.source).toEqual({ uri: "file:///small.jpg" });
});

test("a failed render is retried from the preview instead of opening the document", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  const render$ = jest
    .fn<Render>()
    .mockRejectedValueOnce(new Error("PDF dañado"))
    .mockResolvedValueOnce({ pageCount: 1, pages: [{ uri: "file:///p1.jpg" }] });
  pdfRenderer(render$);
  const onPress = jest.fn();
  await render(<DocumentPreview onPress={onPress} source={{ base64: PDF }} title="Reporte" />);

  expect(
    await screen.findByText("No se pudo generar la vista previa. Toca para reintentar."),
  ).toBeTruthy();
  await fireEvent.press(screen.getByLabelText("Vista previa de Reporte, PDF"));
  expect(await screen.findByText("PDF · 1 página")).toBeTruthy();
  expect(render$).toHaveBeenCalledTimes(2);
  expect(onPress).not.toHaveBeenCalled();
});

test("an image that cannot be decoded becomes a retryable error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await render(<DocumentPreview source={{ base64: "iVBORw0KGgo-dañado" }} title="Captura" />);

  await act(async () => screen.getByTestId("page-image").props.onError({ error: "decode" }));
  expect(screen.queryByTestId("page-image")).toBeNull();
  await fireEvent.press(screen.getByLabelText("Vista previa de Captura, Imagen"));
  expect(screen.getByTestId("page-image")).toBeTruthy();
});

test("switching documents cancels the previous render and ignores its late result", async () => {
  const first = deferred();
  const second = deferred();
  const signals: AbortSignal[] = [];
  pdfRenderer(
    jest
      .fn<Render>((_source, { signal }) => {
        signals.push(signal);
        return signals.length === 1 ? first.promise : second.promise;
      }),
  );
  const view = await render(<DocumentPreview source={{ uri: "file:///a.pdf" }} />);
  await view.rerender(<DocumentPreview source={{ uri: "file:///b.pdf" }} />);
  expect(signals[0]?.aborted).toBe(true);
  expect(signals[1]?.aborted).toBe(false);

  await act(async () => second.resolve({ pageCount: 1, pages: [{ uri: "file:///b-1.jpg" }] }));
  await act(async () => first.resolve({ pageCount: 9, pages: [{ uri: "file:///a-1.jpg" }] }));
  expect(screen.getByTestId("page-image").props.source).toEqual({ uri: "file:///b-1.jpg" });
  expect(screen.getByText("PDF · 1 página")).toBeTruthy();
  await view.unmount();
  expect(signals[1]?.aborted).toBe(true);
});

test("the viewer renders every page, toggles zoom and closes", async () => {
  const render$ = jest.fn<Render>().mockResolvedValue({
    pageCount: 2,
    pages: [
      { uri: "file:///p1.jpg", width: 595, height: 842 },
      { uri: "file:///p2.jpg", width: 595, height: 842 },
    ],
  });
  pdfRenderer(render$);
  const onClose = jest.fn();
  await render(
    <DocumentViewer onClose={onClose} source={{ base64: PDF }} title="Reporte" visible />,
  );

  expect(await screen.findByLabelText("Reporte, página 2 de 2")).toBeTruthy();
  expect(screen.getAllByTestId("page-image")).toHaveLength(2);
  expect(render$).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ firstPageOnly: false }),
  );
  await fireEvent.press(screen.getByLabelText("Ampliar"));
  expect(screen.getByLabelText("Ajustar al ancho")).toBeTruthy();
  await fireEvent.press(screen.getByLabelText("Cerrar"));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("the viewer explains which type has no renderer", async () => {
  await render(<DocumentViewer onClose={jest.fn()} source={{ base64: HTML }} visible />);
  expect(screen.getByText("Esta app no tiene un visor configurado para HTML.")).toBeTruthy();
});

test("the viewer stays closed while there is no document", async () => {
  await render(<DocumentViewer onClose={jest.fn()} source={null} visible />);
  expect(screen.queryByLabelText("Cerrar")).toBeNull();
});
