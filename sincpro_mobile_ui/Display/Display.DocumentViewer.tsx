import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import {
  documentHeading,
  documentMeta,
  DocumentStatus,
  useDocumentPages,
} from "@sincpro/mobile-ui/Display/document-pages";
import type { DocumentRenderer } from "@sincpro/mobile-ui/Display/document-renderer";
import State from "@sincpro/mobile-ui/Feedback/Feedback.State";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { useTheme, useThemeVars } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { DocumentPage, DocumentSource } from "@sincpro/mobile-ui/utils/document";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { type ReactNode, useState } from "react";
import { Modal, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_RENDER_WIDTH = 2048;
const ZOOM_SCALE = 2;
const GUTTER = 12;
const A4_RATIO = 1 / Math.SQRT2;

export interface DocumentViewerProps {
  visible: boolean;
  source: DocumentSource | null;
  title?: string;
  onClose: () => void;
  actions?: ReactNode;
  renderer?: DocumentRenderer;
  testID?: string;
}

interface ViewerPageProps {
  page: DocumentPage;
  width: number;
  number: number;
  pageCount: number;
  label: string;
  onError: () => void;
}

function ViewerPage({ page, width, number, pageCount, label, onError }: ViewerPageProps) {
  const theme = useTheme();
  const [loadedRatio, setLoadedRatio] = useState<number | null>(null);
  const ratio =
    page.width && page.height ? page.width / page.height : (loadedRatio ?? A4_RATIO);

  return (
    <View style={{ width, gap: 6 }}>
      <View
        style={{
          width,
          aspectRatio: ratio,
          borderColor: theme.border.light,
          borderWidth: 1,
          ...theme.shadow.sm,
        }}
      >
        <ExpoImage
          accessibilityLabel={
            pageCount > 1 ? `${label}, página ${number} de ${pageCount}` : label
          }
          accessible
          contentFit="contain"
          onError={onError}
          onLoad={(event) => {
            if (event.source.height > 0)
              setLoadedRatio(event.source.width / event.source.height);
          }}
          source={{ uri: page.uri }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      {pageCount > 1 ? (
        <Typography.Text
          align="center"
          style={{ color: theme.text.secondary }}
          variant="caption"
        >
          Página {number} de {pageCount}
        </Typography.Text>
      ) : null}
    </View>
  );
}

function ViewerContent({
  source,
  title,
  onClose,
  actions,
  renderer,
}: Omit<DocumentViewerProps, "visible" | "source" | "testID"> & { source: DocumentSource }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width, scale } = useWindowDimensions();
  const [zoomed, setZoomed] = useState(false);
  const document = useDocumentPages(
    source,
    Math.min(MAX_RENDER_WIDTH, Math.round(width * scale * ZOOM_SCALE)),
    false,
    renderer,
  );
  const ready = document.status === DocumentStatus.READY;
  const heading = title ?? documentHeading(document);
  const fitWidth = width - insets.left - insets.right - GUTTER * 2;
  const pageWidth = zoomed ? fitWidth * ZOOM_SCALE : fitWidth;

  const pages = (
    <View style={{ gap: GUTTER * 2 }}>
      {document.pages.map((page, index) => (
        <ViewerPage
          key={`${document.attempt}:${index}`}
          label={heading}
          number={index + 1}
          onError={document.reportPageError}
          page={page}
          pageCount={document.pageCount}
          width={pageWidth}
        />
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg.muted }}>
      <AppBar
        actions={
          <>
            {ready ? (
              <AppBar.Action
                accessibilityLabel={zoomed ? "Ajustar al ancho" : "Ampliar"}
                label={zoomed ? "Ajustar" : "Ampliar"}
                onPress={() => setZoomed((previous) => !previous)}
              />
            ) : null}
            {actions}
          </>
        }
        leading={<AppBar.Action accessibilityLabel="Cerrar" icon="close" onPress={onClose} />}
        subtitle={documentMeta(document.label, document.isImage, document.pageCount)}
        title={heading}
      />
      {ready ? (
        <ScrollView
          contentContainerStyle={{
            paddingTop: GUTTER,
            paddingLeft: insets.left + GUTTER,
            paddingRight: insets.right + GUTTER,
            paddingBottom: insets.bottom + GUTTER * 2,
          }}
        >
          {zoomed ? <ScrollView horizontal>{pages}</ScrollView> : pages}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingBottom: insets.bottom }}>
          {document.status === DocumentStatus.LOADING ? (
            <State kind="loading" message="Generando vista previa…" />
          ) : null}
          {document.status === DocumentStatus.ERROR ? (
            <State
              kind="error"
              message="No se pudo generar la vista previa del documento."
              onRetry={document.retry}
            />
          ) : null}
          {document.status === DocumentStatus.UNSUPPORTED ? (
            <State
              description={`Esta app no tiene un visor configurado para ${document.label}.`}
              icon="document"
              kind="empty"
              title="Vista previa no disponible"
            />
          ) : null}
        </View>
      )}
    </View>
  );
}

function DocumentViewer({
  visible,
  source,
  title,
  onClose,
  actions,
  renderer,
  testID,
}: DocumentViewerProps) {
  const reducedMotion = useReducedMotion();
  const themeVars = useThemeVars();

  return (
    <Modal
      animationType={reducedMotion ? "none" : "slide"}
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      visible={visible && source !== null}
    >
      <View style={[{ flex: 1 }, themeVars]} testID={testID}>
        {source ? (
          <ViewerContent
            actions={actions}
            onClose={onClose}
            renderer={renderer}
            source={source}
            title={title}
          />
        ) : null}
      </View>
    </Modal>
  );
}

export default DocumentViewer;
export { DocumentViewer };
