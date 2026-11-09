import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import {
  documentHeading,
  documentMeta,
  DocumentStatus,
  useDocumentPages,
} from "@sincpro/mobile-ui/Display/document-pages";
import type { DocumentRenderer } from "@sincpro/mobile-ui/Display/document-renderer";
import type { IconName } from "@sincpro/mobile-ui/Display/icon-map";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { DocumentSource } from "@sincpro/mobile-ui/utils/document";
import { useWindowDimensions, View } from "react-native";

const MAX_THUMBNAIL_WIDTH = 1080;

export interface DocumentPreviewProps {
  source: DocumentSource;
  title?: string;
  height?: number;
  fit?: "top" | "contain";
  onPress?: () => void;
  renderer?: DocumentRenderer;
  className?: string;
  testID?: string;
}

function Notice({ icon, label, color }: { icon: IconName; label: string; color: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-4">
      <Icon color={color} name={icon} size={28} />
      <Typography.Text align="center" className="text-text-secondary" variant="bodySmall">
        {label}
      </Typography.Text>
    </View>
  );
}

function DocumentPreview({
  source,
  title,
  height = 180,
  fit = "top",
  onPress,
  renderer,
  className,
  testID,
}: DocumentPreviewProps) {
  const theme = useTheme();
  const { width, scale } = useWindowDimensions();
  const document = useDocumentPages(
    source,
    Math.min(MAX_THUMBNAIL_WIDTH, Math.round(width * scale)),
    true,
    renderer,
  );
  const page = document.pages[0];
  const failed = document.status === DocumentStatus.ERROR;
  const heading = title ?? documentHeading(document);
  const meta = documentMeta(document.label, document.isImage, document.pageCount);
  const handlePress = failed ? document.retry : onPress;

  const body = (
    <>
      <View className="px-3 pt-3" style={{ height, backgroundColor: theme.bg.muted }}>
        {document.status === DocumentStatus.READY && page ? (
          <ExpoImage
            contentFit={fit === "top" ? "cover" : "contain"}
            contentPosition="top"
            key={document.attempt}
            onError={document.reportPageError}
            source={{ uri: page.uri }}
            style={{
              flex: 1,
              width: "100%",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          />
        ) : null}
        {document.status === DocumentStatus.LOADING ? (
          <Skeleton height="100%" radius={6} width="100%" />
        ) : null}
        {failed ? (
          <Notice
            color={theme.danger}
            icon="error"
            label="No se pudo generar la vista previa. Toca para reintentar."
          />
        ) : null}
        {document.status === DocumentStatus.UNSUPPORTED ? (
          <Notice
            color={theme.icon.tertiary}
            icon="document"
            label="Vista previa no disponible"
          />
        ) : null}
      </View>
      <View className="flex-row items-center gap-3 px-3 py-2.5">
        <Icon
          color={theme.icon.secondary}
          name={document.isImage ? "image" : "document"}
          size={20}
        />
        <View className="flex-1">
          <Typography.Text className="text-text-primary" numberOfLines={1} semibold>
            {heading}
          </Typography.Text>
          <Typography.Text className="text-text-secondary" variant="caption">
            {meta}
          </Typography.Text>
        </View>
        {onPress && !failed ? (
          <Icon color={theme.icon.tertiary} name="next" size={18} />
        ) : null}
      </View>
    </>
  );

  const surface = cn(
    "overflow-hidden rounded-xl border border-border-light bg-bg-card",
    className,
  );
  const label = `Vista previa de ${heading}, ${meta}`;

  if (!handlePress) {
    return (
      <View
        accessibilityLabel={label}
        accessibilityRole="image"
        accessible
        className={surface}
        testID={testID}
      >
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint={failed ? "Reintenta generar la vista previa" : "Abre el documento"}
      accessibilityLabel={label}
      className={surface}
      onPress={handlePress}
      testID={testID}
    >
      {body}
    </Pressable>
  );
}

export default DocumentPreview;
export { DocumentPreview };
