import { Display } from "@sincpro/mobile-ui/Display";
import { ErrorBoundary, Feedback } from "@sincpro/mobile-ui/Feedback";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ListViewProvider, useListView } from "@sincpro/mobile-ui/views/ListViewV2.context";
import { IRowItem, toRowItems } from "@sincpro/mobile-ui/views/types/IListView";
import { EVariantScreenHeader } from "@sincpro/mobile-ui/widgets/ScreenHeader";
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import type { Edge } from "react-native-safe-area-context";

interface ListViewProps<T> {
  name: string;
  description?: string;
  items: T[];
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  readonly?: boolean;
  onRefresh?: () => Promise<void>;
  onRetry?: () => void;
  onPressItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
  onSearch?: (query: string) => void;
  onBack?: () => void;
  backgroundColor?: string;
  withContainer?: boolean;
  children: ReactNode;
}

function ListViewRoot<T>({
  name,
  description,
  items,
  isLoading = false,
  hasError = false,
  errorMessage,
  readonly = false,
  onRefresh,
  onRetry,
  onPressItem,
  onDeleteItem,
  onSearch,
  onBack,
  backgroundColor,
  withContainer = true,
  children,
}: ListViewProps<T>) {
  const Wrapper = withContainer ? Container : View;
  // The header (AppBar) / parent layout owns the TOP safe-area; the Container only reserves
  // the remaining edges to avoid stacking the top inset (double padding).
  const wrapperProps = withContainer
    ? { edges: ["bottom", "left", "right"] as Edge[] }
    : { className: "flex-1 bg-bg-page" };

  // Propagate contentWithMargin to ContentList via context
  return (
    <ListViewProvider
      description={description}
      errorMessage={errorMessage}
      hasError={hasError}
      isLoading={isLoading}
      items={items}
      name={name}
      onBack={onBack}
      onDeleteItem={onDeleteItem}
      onPressItem={onPressItem}
      onRefresh={onRefresh}
      onRetry={onRetry}
      onSearch={onSearch}
      readonly={readonly}
    >
      <ErrorBoundary>
        <Wrapper {...wrapperProps}>{children}</Wrapper>
      </ErrorBoundary>
    </ListViewProvider>
  );
}

function Header({
  children,
}: {
  /** @deprecated The header is now flat (Navigation.AppBar); `variant` is ignored. */
  variant?: EVariantScreenHeader;
  children?: ReactNode;
}) {
  const { name, description, onBack } = useListView();

  return (
    <Navigation.AppBar
      onBack={onBack}
      safeArea={false}
      subheader={children}
      subtitle={description ? description : `Seleccionar ${name}`}
      title={name}
    />
  );
}

function HeaderSearch({ searchQuery = "" }: { searchQuery?: string }) {
  const { name, onSearch } = useListView();
  const [query, setQuery] = useState<string>(searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (onSearch && debouncedQuery !== undefined) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  if (!onSearch) {
    return null;
  }

  return (
    <View className="pb-2">
      <Navigation.SearchBar
        onChangeText={setQuery}
        placeholder={`Buscar ${name}`}
        value={query}
      />
    </View>
  );
}

function HeaderActions({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row px-4 my-3 items-center justify-between flex-1 gap-2">
      {children}
    </View>
  );
}

function HeaderFilters({ children }: { children: ReactNode }) {
  return <View className="px-4 py-2 items-center">{children}</View>;
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

const filterChip = tv({
  base: "py-[5px] px-2.5 items-center justify-center rounded-md",
  variants: {
    active: {
      true: "bg-primary",
      false: "bg-transparent",
    },
  },
  defaultVariants: { active: false },
});

const filterChipText = tv({
  variants: {
    active: {
      true: "text-text-on-primary font-semibold",
      false: "text-text-secondary",
    },
  },
  defaultVariants: { active: false },
});

function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={filterChip({ active })}
      onPress={onPress}
    >
      <Typography.Text className={filterChipText({ active })} variant="bodySmall">
        {active ? "• " : ""}
        {label}
      </Typography.Text>
    </TouchableOpacity>
  );
}

function FilterChips({ children }: { children: ReactNode }) {
  const childArray = React.Children.toArray(children);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      <View className="flex-row bg-bg-card rounded-[10px] border-[1.5px] border-border-default self-center shadow-sm overflow-hidden">
        {childArray.map((child, index) => (
          <View className="flex-row items-center" key={index}>
            {child}
            {index < childArray.length - 1 && (
              <View className="w-[1.5px] h-[22px] bg-border-divider opacity-50 my-0.5" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Content({
  children,
  withMargin = true,
}: {
  children?: (item: any) => ReactNode;
  withMargin?: boolean;
}) {
  const {
    name,
    items,
    isLoading,
    hasError,
    errorMessage,
    onRefresh,
    onRetry,
    onBack,
    showRefreshing,
    setShowRefreshing,
  } = useListView();

  const handleRefresh = useCallback(async () => {
    setShowRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setShowRefreshing(false);
  }, [onRefresh, setShowRefreshing]);

  if (isLoading) {
    return <Feedback.Loading message={`Cargando ${name}...`} />;
  }

  if (hasError) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
      >
        <Feedback.Error message={errorMessage} onBack={onBack} onRetry={onRetry} />
      </ScrollView>
    );
  }

  if (items.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
      >
        <Feedback.Empty />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Display.CountRecords count={items.length || 0} name={name} />
      <ContentList contentWithMargin={withMargin}>{children}</ContentList>
    </View>
  );
}

function ContentList({
  children,
  contentWithMargin,
}: {
  children?: (item: any) => ReactNode;
  contentWithMargin: boolean;
}) {
  const {
    items,
    onRefresh,
    showRefreshing,
    setShowRefreshing,
    onPressItem,
    onDeleteItem,
    readonly,
  } = useListView();
  const rowItems = useMemo(() => toRowItems(items), [items]);

  const handleRefresh = useCallback(async () => {
    setShowRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setShowRefreshing(false);
  }, [onRefresh, setShowRefreshing]);

  const renderItem = useCallback(
    ({ item }: { item: IRowItem<any> }) => {
      if (children) {
        return <>{children(item)}</>;
      }

      const onPress = () => onPressItem?.(item);
      const onDelete = () => onDeleteItem?.(item);
      const isReadOnly = item.readonly || readonly || false;

      return (
        <Navigation.RowItem
          item={{ ...item }}
          onDelete={onDelete}
          onPress={onPress}
          readonly={isReadOnly}
        />
      );
    },
    [children, onPressItem, onDeleteItem, readonly],
  );

  return (
    <View
      style={{
        flex: 1,
        marginTop: 2,
        paddingHorizontal: contentWithMargin ? 4 : 0,
      }}
    >
      <FlatList
        data={rowItems}
        keyExtractor={(item) => String(item.index)}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        renderItem={renderItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function Footer({ children }: { children: ReactNode }) {
  const { items } = useListView();

  if (items.length === 0) {
    return null;
  }

  return <View className="px-4">{children}</View>;
}

function FloatingButton({ children }: { children: ReactNode }) {
  return <View className="absolute bottom-[50px] right-6 z-10">{children}</View>;
}

interface RowRootProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

function RowRoot({
  children,
  onPress,
  onLongPress,
  showDivider = true,
  style,
  backgroundColor,
}: RowRootProps) {
  const baseClass = "flex-row items-center py-3 px-4 bg-bg-card";
  const dividerClass = showDivider ? " border-b border-border-default" : "";

  const content = (
    <View
      className={baseClass + dividerClass}
      style={[backgroundColor ? { backgroundColor } : undefined, style]}
    >
      {children}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onLongPress={onLongPress} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface RowAvatarProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function RowAvatar({ children, style }: RowAvatarProps) {
  return (
    <View className="mr-3 justify-center items-center" style={style}>
      {children}
    </View>
  );
}

interface RowContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function RowContent({ children, style }: RowContentProps) {
  return (
    <View className="flex-1 gap-0.5" style={style}>
      {children}
    </View>
  );
}

interface RowTitleProps {
  children: ReactNode;
  badge?: ReactNode;
  rightComponent?: ReactNode;
  numberOfLines?: number;
}

function RowTitle({ children, badge, rightComponent, numberOfLines = 1 }: RowTitleProps) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Typography.Text
        className="flex-1 flex-shrink min-w-0"
        numberOfLines={numberOfLines}
        semibold
        variant="body"
      >
        {children}
      </Typography.Text>
      <View className="flex-row items-center gap-2">
        {badge}
        {rightComponent}
      </View>
    </View>
  );
}

interface RowSubtitleProps {
  children: ReactNode;
  className?: string;
}

function RowSubtitle({ children, className }: RowSubtitleProps) {
  return (
    <Typography.Text className={cn("text-text-secondary", className)} variant="bodySmall">
      {children}
    </Typography.Text>
  );
}

interface RowFooterProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

function RowFooter({ left, right, children }: RowFooterProps) {
  if (children) {
    return <View className="mt-1">{children}</View>;
  }

  return (
    <View className="flex-row items-center justify-between mt-1">
      <View className="flex-row items-center gap-2">{left}</View>
      <View className="flex-row items-center">{right}</View>
    </View>
  );
}

interface RowActionsProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function RowActions({ children, style }: RowActionsProps) {
  return (
    <View className="flex-row items-center gap-1 ml-2" style={style}>
      {children}
    </View>
  );
}

interface RowActionButtonProps {
  icon: ReactNode;
  onPress?: () => void;
}

function RowActionButton({ icon, onPress }: RowActionButtonProps) {
  return (
    <TouchableOpacity className="p-1.5 rounded" onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
}

const FiltersWithSubComponents = Object.assign(HeaderFilters, {
  Chip: FilterChip,
  Chips: FilterChips,
});

const HeaderWithSubComponents = Object.assign(Header, {
  Search: HeaderSearch,
  Actions: HeaderActions,
  Filters: FiltersWithSubComponents,
});

const RowWithSubComponents = Object.assign(RowRoot, {
  Avatar: RowAvatar,
  Content: RowContent,
  Title: RowTitle,
  Subtitle: RowSubtitle,
  Footer: RowFooter,
  Actions: RowActions,
  ActionButton: RowActionButton,
});

const ContentWithSubComponents = Object.assign(Content, {
  List: ContentList,
  Row: RowWithSubComponents,
});

export const ListViewV2 = {
  Root: ListViewRoot,
  Header: HeaderWithSubComponents,
  Content: ContentWithSubComponents,
  Footer,
  FloatingButton,
};

export default ListViewV2;
