import { Display } from "@sincpro/mobile-ui/Display";
import SearchHistory, {
  type SearchHistoryProps,
} from "@sincpro/mobile-ui/Display/Display.SearchHistory";
import { ErrorBoundary, Feedback } from "@sincpro/mobile-ui/Feedback";
import { useBottomInset } from "@sincpro/mobile-ui/layouts/BottomInset";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ListViewProvider, useListView } from "@sincpro/mobile-ui/views/ListViewV2.context";
import { IRowItem, toRowItems } from "@sincpro/mobile-ui/views/types/IListView";
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
  /** Called when the list nears the end — wire to fetch the next page. */
  onLoadMore?: () => void;
  /** Show a footer spinner while the next page loads. */
  loadingMore?: boolean;
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
  onLoadMore,
  loadingMore = false,
  backgroundColor,
  withContainer = true,
  children,
}: ListViewProps<T>) {
  const Wrapper = withContainer ? Container : View;
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
      loadingMore={loadingMore}
      name={name}
      onBack={onBack}
      onDeleteItem={onDeleteItem}
      onLoadMore={onLoadMore}
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

interface HeaderProps {
  /** AppBar display variant. `large` = big title (list/index). `center` = modal/detail. */
  variant?: "default" | "large" | "center";
  /** Surface tone. `dark` = always-dark hero. `gradient` = brand accent gradient. */
  tone?: "default" | "dark" | "gradient";
  /** Actions rendered in the AppBar action slot (AppBar.Action nodes). */
  actions?: ReactNode;
  /** Subheader content rendered below the title bar (SearchBar, SegmentedControl, etc.). */
  children?: ReactNode;
  /**
   * Gradient + texture surface. Automatically activates white text/icons.
   * See `AppBarBackground` for the full shape.
   */
  background?: AppBarBackground;
  /**
   * [large variant] Extra top padding (px) above the large title.
   * Use ~16 on root screens (no back button) for breathing room.
   */
  topSpacing?: number;
}

function Header({
  variant = "large",
  tone,
  actions,
  children,
  background,
  topSpacing,
}: HeaderProps) {
  const { name, description, onBack } = useListView();

  return (
    <Navigation.AppBar
      actions={actions}
      background={background}
      onBack={onBack}
      safeArea={false}
      subheader={children}
      subtitle={description ?? undefined}
      title={name}
      tone={tone}
      topSpacing={topSpacing}
      variant={variant}
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
  }, [debouncedQuery, onSearch]);

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
 * Tab-like segmented switch for the header subheader (e.g. "Activos" / "Archivados").
 * Use as a child of `<ListViewV2.Header>` — it lands in the AppBar subheader slot.
 */
function HeaderSegmented<T extends string>(props: SegmentedControlProps<T>) {
  return <SegmentedControl {...props} />;
}

/**
 * Recent-searches list. Render as a SIBLING of the Header (like Filters/ActionsBar) —
 * typically while the search query is empty. Delegates to `Display.SearchHistory`.
 */
function HeaderSearchHistory(props: SearchHistoryProps) {
  return <SearchHistory {...props} />;
}

function HeaderFilters({ children }: { children: ReactNode }) {
  return <View className="px-4 py-2 items-center">{children}</View>;
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

// Modern filter pills (2026): rounded-full, active = accent (green), inactive = muted track.
const filterChip = tv({
  base: "py-1.5 px-3.5 items-center justify-center rounded-full",
  variants: {
    active: {
      true: "bg-accent",
      false: "bg-bg-muted",
    },
  },
  defaultVariants: { active: false },
});

const filterChipText = tv({
  variants: {
    active: {
      true: "text-text-inverse font-semibold",
      false: "text-text-secondary",
    },
  },
  defaultVariants: { active: false },
});

function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={filterChip({ active })}
      onPress={onPress}
    >
      <Typography.Text className={filterChipText({ active })} variant="bodySmall">
        {label}
      </Typography.Text>
    </TouchableOpacity>
  );
}

function FilterChips({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      {children}
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

  const bottomInset = useBottomInset();
  const theme = useTheme();

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
          paddingBottom: bottomInset,
        }}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        style={{ backgroundColor: theme.bg.page }}
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
          paddingBottom: bottomInset,
        }}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        style={{ backgroundColor: theme.bg.page }}
      >
        <Feedback.Empty />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg.page }}>
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
    onLoadMore,
    loadingMore,
  } = useListView();
  const bottomInset = useBottomInset();
  const theme = useTheme();
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
        backgroundColor: theme.bg.page,
      }}
    >
      <FlatList
        contentContainerStyle={bottomInset ? { paddingBottom: bottomInset } : undefined}
        data={rowItems}
        keyExtractor={(item) => String(item.index)}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4">
              <Feedback.Spinner size="small" />
            </View>
          ) : null
        }
        onEndReached={onLoadMore ? () => onLoadMore() : undefined}
        onEndReachedThreshold={0.5}
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
  SearchHistory: HeaderSearchHistory,
  Segmented: HeaderSegmented,
  Actions: HeaderActions,
  ActionsBar: HeaderActionsBar,
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

/**
 * Screen container for a collection (list / index / search results).
 * Owns safe-area, the FlatList (pagination + pull-to-refresh), record count, and the
 * loading/empty/error states.
 *
 * API map:
 *   ListViewV2.Root          — provider + container; pass `items`, `onSearch`, `onLoadMore`, `onBack`…
 *   ListViewV2.Header            — AppBar (variant: default | large | center · tone: default | dark | gradient)
 *     .Header.Search             — debounced SearchBar in the subheader (wires `onSearch`)
 *     .Header.SearchHistory      — recent-searches list (SIBLING; show while query is empty)
 *     .Header.Segmented          — tab-like switch in the subheader (Activos / Archivados)
 *     .Header.Filters(.Chips/.Chip) — horizontal filter pills (SIBLING below the header)
 *     .Header.ActionsBar         — SIBLING bar below the header (bulk select, etc.)
 *   ListViewV2.Content           — FlatList body; `children` is an optional custom row renderer
 *     .Content.Row(.Avatar/.Content/.Title/.Subtitle/.Footer/.Actions/.ActionButton)
 *   ListViewV2.Footer        — pinned footer (hidden when empty)
 *   ListViewV2.FloatingButton — absolute FAB overlay
 */
export const ListViewV2 = {
  Root: ListViewRoot,
  Header: HeaderWithSubComponents,
  Content: ContentWithSubComponents,
  Footer,
  FloatingButton,
};

export default ListViewV2;
