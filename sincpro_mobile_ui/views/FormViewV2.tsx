import { ErrorBoundary, Feedback } from "@sincpro/mobile-ui/Feedback";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { theme } from "@sincpro/mobile-ui/theme";
import { FormViewProvider, useFormView } from "@sincpro/mobile-ui/views/FormViewV2.context";
import { EVariantScreenHeader } from "@sincpro/mobile-ui/widgets/ScreenHeader";
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

function Header({
  children,
}: {
  /** @deprecated The header is now flat (Navigation.AppBar); `variant`/`logoSource` are ignored. */
  variant?: EVariantScreenHeader;
  logoSource?: ImageSourcePropType;
  children?: ReactNode;
}) {
  const { name, description, onBack } = useFormView();

  return (
    <AppBar
      onBack={onBack}
      safeArea={false}
      subheader={children}
      subtitle={description ? description : `Seleccionar ${name}`}
      title={name}
    />
  );
}

function HeaderActions({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row px-4 my-4 items-center justify-between flex-1 gap-2">
      {children}
    </View>
  );
}

function HeaderActionsBar({ children }: { children: ReactNode }) {
  return (
    <View className="bg-bg-card px-4 py-3 border-b border-border-default flex-row gap-2">
      {children}
    </View>
  );
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

function Form({ children }: { children: ReactNode }) {
  const { isEmpty, item } = useFormView();

  if (isEmpty || !item) {
    return <Feedback.Empty />;
  }

  return <>{children}</>;
}

function Groups({ children }: { children: ReactNode }) {
  const { isEmpty } = useFormView();

  if (isEmpty) {
    return null;
  }

  return <>{children}</>;
}

function Group({
  children,
  withMargin = true,
  elevation = "md",
}: {
  children: ReactNode;
  withMargin?: boolean;
  elevation?: "sm" | "md" | "lg";
}) {
  const groupClass = withMargin
    ? "bg-bg-card mx-4 my-1 p-1 rounded-lg border border-border-light"
    : "bg-bg-card p-1 rounded-lg border border-border-light";

  return (
    <View className={groupClass} style={theme.shadow[elevation]}>
      {children}
    </View>
  );
}

function Footer({ children }: { children: ReactNode }) {
  const { isEmpty, isLoading } = useFormView();

  if (isEmpty || isLoading) {
    return null;
  }

  return (
    <View
      className="bg-bg-card px-4 py-3 border-t border-border-default"
      style={theme.shadow.sm}
    >
      {children}
    </View>
  );
}

// Nested Header components
const HeaderWithSubComponents = Object.assign(Header, {
  Actions: HeaderActions,
  ActionsBar: HeaderActionsBar,
});

// Nested Content components
const ContentWithSubComponents = Object.assign(Content, {
  Form,
  Groups,
  Group,
});

export const FormViewV2 = {
  Root: FormViewRoot,
  Header: HeaderWithSubComponents,
  Content: ContentWithSubComponents,
  Footer,
};

export default FormViewV2;
