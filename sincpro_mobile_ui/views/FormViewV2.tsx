import { Display } from "@sincpro/mobile-ui/Display";
import { ErrorBoundary, Feedback } from "@sincpro/mobile-ui/Feedback";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import { theme } from "@sincpro/mobile-ui/theme";
import { FormViewProvider, useFormView } from "@sincpro/mobile-ui/views/FormViewV2.context";
import React, { ReactNode } from "react";
import { type ImageSourcePropType, RefreshControl, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import type { Edge } from "react-native-safe-area-context";

interface FormViewProps<T> {
  name: string;
  description?: string;
  item: T | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  readonly?: boolean;
  onRefresh?: () => Promise<void>;
  onRetry?: () => void;
  onBack?: () => void;
  withContainer?: boolean;
  children: ReactNode;
}

function FormViewRoot<T>({
  name,
  description,
  item,
  isLoading = false,
  isEmpty = false,
  hasError = false,
  errorMessage,
  readonly = false,
  onRefresh,
  onRetry,
  onBack,
  withContainer = true,
  children,
}: FormViewProps<T>) {
  const Wrapper = withContainer ? Container : View;
  // The header (AppBar) / parent layout owns the TOP safe-area; the inner Container only
  // reserves the remaining edges to avoid stacking the top inset (double padding).
  const wrapperProps = withContainer
    ? { edges: ["bottom", "left", "right"] as Edge[] }
    : { style: { flex: 1 } };

  return (
    <FormViewProvider
      description={description}
      errorMessage={errorMessage}
      hasError={hasError}
      isEmpty={isEmpty}
      isLoading={isLoading}
      item={item}
      name={name}
      onBack={onBack}
      onRefresh={onRefresh}
      onRetry={onRetry}
      readonly={readonly}
    >
      <ErrorBoundary>
        <Wrapper {...wrapperProps}>{children}</Wrapper>
      </ErrorBoundary>
    </FormViewProvider>
  );
}

interface HeaderProps {
  /** AppBar display variant. `large` = big title (list/index screens). `center` = modal/detail. */
  variant?: "default" | "large" | "center";
  /** Surface tone. `dark` = always-dark hero. `gradient` = brand accent gradient. */
  tone?: "default" | "dark" | "gradient";
  /** Actions rendered in the AppBar action slot (AppBar.Action nodes). */
  actions?: ReactNode;
  /** Subheader content rendered below the title bar (SearchBar, SegmentedControl, etc.). */
  children?: ReactNode;
  /** @deprecated Pass `variant` prop instead. */
  logoSource?: ImageSourcePropType;
}

function Header({ variant = "default", tone, actions, children }: HeaderProps) {
  const { name, description, onBack } = useFormView();

  return (
    <AppBar
      actions={actions}
      onBack={onBack}
      safeArea={false}
      subheader={children}
      subtitle={description ?? undefined}
      title={name}
      tone={tone}
      variant={variant}
    />
  );
}

function HeaderActions({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row px-4 my-2 items-center justify-between flex-1 gap-2">
      {children}
    </View>
  );
}

/** Secondary action bar docked below the AppBar — use for Save/Cancel, filter chips, etc. */
function HeaderActionsBar({ children }: { children: ReactNode }) {
  return (
    <View className="bg-bg-card px-4 pt-1 pb-3 border-b border-border-light flex-row gap-2 items-center">
      {children}
    </View>
  );
}

/**
 * Tab-like segmented switch for the header subheader (e.g. "Detalles" / "Historial").
 * Use as a child of `<FormViewV2.Header>` — it lands in the AppBar subheader slot.
 */
function HeaderSegmented<T extends string>(props: SegmentedControlProps<T>) {
  return <SegmentedControl {...props} />;
}

function Content({
  withMargin = false,
  children,
}: {
  withMargin?: boolean;
  children: ReactNode;
}) {
  const {
    name,
    isLoading,
    isEmpty,
    hasError,
    errorMessage,
    item,
    onRefresh,
    onRetry,
    onBack,
    showRefreshing,
    setShowRefreshing,
  } = useFormView();

  const handleRefresh = React.useCallback(async () => {
    setShowRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setShowRefreshing(false);
  }, [onRefresh, setShowRefreshing]);

  const isCenteredContent = isLoading || isEmpty || !item || hasError;

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: isCenteredContent ? "center" : "flex-start",
        alignItems: isCenteredContent ? "center" : "stretch",
      }}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          colors={[theme.primary]}
          onRefresh={handleRefresh}
          refreshing={showRefreshing}
        />
      }
      style={{ flex: 1 }}
    >
      {isCenteredContent ? (
        <>
          {isLoading ? (
            <Feedback.Loading message={`Cargando ${name}...`} />
          ) : hasError ? (
            <Feedback.Error message={errorMessage} onBack={onBack} onRetry={onRetry} />
          ) : (
            <Feedback.Empty />
          )}
        </>
      ) : (
        <View style={withMargin ? { paddingHorizontal: 16 } : undefined}>{children}</View>
      )}
    </KeyboardAwareScrollView>
  );
}

/**
 * @deprecated Content already handles isEmpty/!item by rendering Feedback.Empty internally.
 * Use `<FormViewV2.Content>` directly — this wrapper is redundant.
 */
function Form({ children }: { children: ReactNode }) {
  const { isEmpty, item } = useFormView();

  if (isEmpty || !item) {
    return <Feedback.Empty />;
  }

  return <>{children}</>;
}

/** Layout wrapper for a set of Group cards. Content already handles isEmpty/loading states. */
function Groups({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Card-bordered input group for form fields. Use inside `Content.Groups`.
 *
 * Separation — by DEFAULT each Group is its own inset card (`withMargin=true`:
 * margin 16/4, iOS "grouped" style), so several Groups read as separate sections.
 * If you DON'T want separation, put all fields in a SINGLE Group (one continuous
 * card), or pass `withMargin={false}` to render flush/edge-to-edge — e.g. when
 * embedding inside your own layout.
 *
 * `title` renders a SectionHeader label above the card.
 */
function Group({
  children,
  withMargin = true,
  elevation = "none",
  padding = "md",
  variant = "card",
  title,
}: {
  children: ReactNode;
  /** `true` (default) = inset card with margins; `false` = flush, no margin. */
  withMargin?: boolean;
  /**
   * Frame style. `card` (default) wraps fields in a Display.Card. `plain` drops the
   * frame so the content sits directly on the page — useful when the children already
   * carry their own surface (Form.Input, Display.Card, custom rows) and a wrapping card
   * would just double up.
   */
  variant?: "card" | "plain";
  /**
   * [card only] Shadow. `none` (default) = flat — the inputs already carry their own card
   * surface, so a group shadow only adds a "floating" double-shadow. Opt into `sm`/`md`
   * for a raised group when it sits directly on the page.
   */
  elevation?: "none" | "sm" | "md" | "lg";
  /**
   * Inner padding (Display.Card scale). `md` (default) aligns the title with the labels.
   * Applies to BOTH variants, so `plain` keeps the exact same content position as `card`.
   */
  padding?: "none" | "sm" | "md" | "lg";
  /** Label rendered above the group (SectionHeader style). */
  title?: string;
}) {
  // `plain` mirrors the card's inner padding so the content lands in the SAME position
  // as `card` — only the frame (border/bg/shadow) is dropped.
  const paddingClass = { none: "p-0", sm: "p-3", md: "p-4", lg: "p-6" }[padding];

  const body =
    variant === "plain" ? (
      <View className={paddingClass}>{children}</View>
    ) : (
      <Display.Card elevation={elevation} padding={padding}>
        {children}
      </Display.Card>
    );

  // Title alignment is identical in both variants (same inset as the card's content).
  const header = title ? <Display.SectionHeader title={title} /> : null;

  if (withMargin) {
    return (
      <View style={{ marginHorizontal: 16, marginVertical: 6 }}>
        {header}
        {body}
      </View>
    );
  }

  return (
    <>
      {header}
      {body}
    </>
  );
}

/**
 * Settings-style section: SectionHeader label + Card(padding="none") wrapper.
 * Use inside FormViewV2.Content for preference/config screens where rows are
 * Display.ListItem or Display.MenuButton (not form inputs).
 */
function Section({
  title,
  children,
  withMargin = true,
}: {
  title?: string;
  children: ReactNode;
  withMargin?: boolean;
}) {
  return (
    <View style={withMargin ? { marginHorizontal: 16 } : undefined}>
      {title ? <Display.SectionHeader title={title} /> : null}
      <Display.Card padding="none">{children}</Display.Card>
    </View>
  );
}

function Footer({ children }: { children: ReactNode }) {
  const { isEmpty, isLoading } = useFormView();

  if (isEmpty || isLoading) {
    return null;
  }

  // Sticky bottom bar (lives outside the scroll). No shadow — a top hairline integrates it
  // with the form instead of reading as a detached floating card.
  return (
    <View className="bg-bg-card px-4 py-3 border-t border-border-light">{children}</View>
  );
}

// Nested Header components
const HeaderWithSubComponents = Object.assign(Header, {
  Actions: HeaderActions,
  ActionsBar: HeaderActionsBar,
  Segmented: HeaderSegmented,
});

// Nested Content components
const ContentWithSubComponents = Object.assign(Content, {
  Form,
  Groups,
  Group,
  Section,
});

/**
 * Screen container for a single record (detail / create / edit / settings).
 * Owns safe-area, scroll (KeyboardAware), refresh, and the loading/empty/error states.
 *
 * API map:
 *   FormViewV2.Root      — provider + container; pass `item`, `isLoading`, `hasError`, `onBack`…
 *   FormViewV2.Header        — AppBar (variant: default | large | center · tone: default | dark | gradient)
 *     .Header child            → subheader slot: <Header.Segmented> or any node (SearchBar, etc.)
 *     .Header.Segmented        — tab-like switch in the subheader (Detalles / Historial)
 *     .Header.ActionsBar       — SIBLING bar below the header (Guardar / Cancelar)
 *     .Header.Actions          — inline action row (legacy helper)
 *   FormViewV2.Content       — scroll body; renders Feedback for loading/empty/error
 *     .Content.Groups          — layout wrapper for Group cards
 *     .Content.Group           — bordered card of inputs (optional `title`)
 *     .Content.Section         — SectionHeader + Card (settings/menu rows)
 *   FormViewV2.Footer        — sticky bottom bar (primary CTA)
 */
export const FormViewV2 = {
  Root: FormViewRoot,
  Header: HeaderWithSubComponents,
  Content: ContentWithSubComponents,
  Footer,
};

export default FormViewV2;
