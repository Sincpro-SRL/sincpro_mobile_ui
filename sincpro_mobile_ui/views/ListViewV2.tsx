import {
  FlashList,
  type FlashListRef,
  type ListRenderItemInfo,
  type ViewToken,
} from "@shopify/flash-list";
import { FilterChip } from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
import { Display } from "@sincpro/mobile-ui/Display";
import SearchHistory, {
  type SearchHistoryProps,
} from "@sincpro/mobile-ui/Display/Display.SearchHistory";
import { ErrorBoundary, Feedback } from "@sincpro/mobile-ui/Feedback";
import { useBottomInset } from "@sincpro/mobile-ui/layouts/BottomInset";
import Container from "@sincpro/mobile-ui/layouts/Container";
import type { SafeAreaEdge } from "@sincpro/mobile-ui/layouts/edges";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import type { SearchBarProps } from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import {
  SegmentedControl,
  type SegmentedControlProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SegmentedControl";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ListViewProvider, useListView } from "@sincpro/mobile-ui/views/ListViewV2.context";
import { type IRowItem, toRowItems } from "@sincpro/mobile-ui/views/types/IListView";
import {
  createContext,
  ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RefreshControl,
  ScrollView,
  type ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

interface ListViewProps<T> {
  name: string;
  description?: string;
  items: readonly T[];
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  readonly?: boolean;
  onRefresh?: () => Promise<void>;
  onRefreshError?: (error: unknown) => void;
  onRetry?: () => void;
  onPressItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
  onSearch?: (query: string) => void;
  onBack?: () => void;
  /** Called when the list nears the end — wire to fetch the next page. */
  onLoadMore?: () => void;
  /** Show a footer spinner while the next page loads. */
  loadingMore?: boolean;
  hasMore?: boolean;
  backgroundColor?: string;
  withContainer?: boolean;
  edges?: SafeAreaEdge[];
  children: ReactNode;
}

const RefreshErrorContext = createContext<((error: unknown) => void) | undefined>(undefined);

export async function refreshListData(
  onRefresh: (() => Promise<void>) | undefined,
  onRefreshError: ((error: unknown) => void) | undefined,
  setShowRefreshing: (value: boolean) => void,
): Promise<void> {
  setShowRefreshing(true);
  try {
    await onRefresh?.();
  } catch (error) {
    console.error("[ListViewV2] Refresh failed", error);
    try {
      onRefreshError?.(error);
    } catch (callbackError) {
      console.error("[ListViewV2] onRefreshError callback failed", callbackError);
    }
  } finally {
    setShowRefreshing(false);
  }
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
  onRefreshError,
  onRetry,
  onPressItem,
  onDeleteItem,
  onSearch,
  onBack,
  onLoadMore,
  loadingMore = false,
  hasMore = true,
  backgroundColor,
  withContainer = true,
  edges,
  children,
}: ListViewProps<T>) {
  const style = backgroundColor ? { backgroundColor } : undefined;

  return (
    <ListViewProvider
      description={description}
      errorMessage={errorMessage}
      hasError={hasError}
      hasMore={hasMore}
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
      <RefreshErrorContext.Provider value={onRefreshError}>
        <ErrorBoundary>
          {withContainer ? (
            <Container edges={edges} style={style}>
              {children}
            </Container>
          ) : (
            <View className="flex-1 bg-bg-page" style={style}>
              {children}
            </View>
          )}
        </ErrorBoundary>
      </RefreshErrorContext.Provider>
    </ListViewProvider>
  );
}

interface HeaderProps {
  /** Reserve the top inset; disable when the host already handles it. */
  safeArea?: boolean;
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
  safeArea = true,
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
      safeArea={safeArea}
      subheader={children}
      subtitle={description ?? undefined}
      title={name}
      tone={tone}
      topSpacing={topSpacing}
      variant={variant}
    />
  );
}

const SEARCH_DEBOUNCE_MS = 400;

function HeaderSearch({
  searchQuery = "",
  textVariant,
}: {
  searchQuery?: string;
  /** Typography variant of the query; see `Navigation.SearchBar` (defaults to 17). */
  textVariant?: SearchBarProps["textVariant"];
}) {
  const { name, onSearch } = useListView();
  const [query, setQuery] = useState<string>(searchQuery);
  // Reads the host's latest callback without restarting the debounce when its
  // identity changes, so a new `onSearch` never repeats a search.
  const search = useEffectEvent((value: string) => onSearch?.(value));

  useEffect(() => {
    const timeout = setTimeout(() => search(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!onSearch) {
    return null;
  }

  return (
    <View className="pb-2">
      <Navigation.SearchBar
        onChangeText={setQuery}
        placeholder={`Buscar ${name}`}
        textVariant={textVariant}
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

type ListScrollProps = Pick<
  ScrollViewProps,
  "keyboardShouldPersistTaps" | "keyboardDismissMode" | "testID"
>;

/** A row on screen, as the screen knows it: the original item and its position. */
export interface ListViewVisibleRow<T> {
  item: T;
  index: number;
}

/**
 * Recycling and viewport options in the DS vocabulary. The engine behind them
 * (FlashList v2 today) can change without touching a screen.
 */
export interface ListViewTuning<T> {
  /** Pixels rendered ahead of the viewport. Raise it only if fast flings show blank rows. */
  drawDistance?: number;
  /**
   * Rows with different layouts (header row, card, compact) return different types so
   * the engine recycles each one into a view with the same shape.
   */
  rowType?: (item: T, index: number) => string | number;
  /** A value outside `items` that changes how rows look (selection, mode). */
  extraData?: unknown;
  /** Row the list opens at. */
  initialIndex?: number;
  /** Distance to the end, in viewport heights, that triggers `onLoadMore`. Default 0.5. */
  loadMoreThreshold?: number;
  /** Keep the rows on screen in place when items are added above them (chat, timeline). */
  keepVisiblePosition?: boolean;
  /**
   * Rows that became visible, with the original items. Pass it from the first render:
   * the engine wires viewability once.
   */
  onVisibleRowsChange?: (rows: ListViewVisibleRow<T>[]) => void;
  /** Percent of a row that must be on screen to count as visible. */
  visiblePercent?: number;
}

export interface ListViewScrollOptions {
  /** Default true. */
  animated?: boolean;
}

/** Imperative scroll for `ListViewV2.Content ref`. Calls are ignored while no list is shown. */
export interface ListViewHandle {
  scrollToIndex(
    index: number,
    options?: ListViewScrollOptions & { position?: "start" | "center" | "end" },
  ): Promise<void>;
  scrollToTop(options?: ListViewScrollOptions): void;
  scrollToEnd(options?: ListViewScrollOptions): void;
}

const VIEW_POSITION = { start: 0, center: 0.5, end: 1 } as const;
const KEEP_POSITION_OFF = { disabled: true } as const;

type EngineRef<T> = RefObject<FlashListRef<IRowItem<T>> | null>;

function rowKey<T>(row: IRowItem<T>): string {
  return String(row.id);
}

function ContentList<T = unknown>({
  children,
  contentWithMargin,
  keyboardShouldPersistTaps,
  keyboardDismissMode,
  testID,
  tuning,
  engineRef,
  contentContainerStyle,
}: {
  children?: (item: T, row: IRowItem<T>) => ReactNode;
  contentWithMargin: boolean;
  tuning?: ListViewTuning<T>;
  engineRef: EngineRef<T>;
  contentContainerStyle?: StyleProp<ViewStyle>;
} & ListScrollProps) {
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
    hasMore,
  } = useListView<T>();
  const bottomInset = useBottomInset();
  const theme = useTheme();
  const rowItems = useMemo(() => toRowItems(items), [items]);
  const onRefreshError = useContext(RefreshErrorContext);

  const handleRefresh = useCallback(async () => {
    await refreshListData(onRefresh, onRefreshError, setShowRefreshing);
  }, [onRefresh, onRefreshError, setShowRefreshing]);

  const renderItem = useCallback(
    ({ item: row }: ListRenderItemInfo<IRowItem<T>>) => {
      if (children) {
        return <>{children(row.item, row)}</>;
      }

      const onPress = () => onPressItem?.(row.item);
      const onDelete = () => onDeleteItem?.(row.item);
      const isReadOnly = row.readonly || readonly || false;

      return (
        <Navigation.RowItem
          item={row}
          onDelete={onDelete}
          onPress={onPress}
          readonly={isReadOnly}
        />
      );
    },
    [children, onPressItem, onDeleteItem, readonly],
  );

  const rowType = tuning?.rowType;
  const getItemType = useMemo(
    () =>
      rowType ? (row: IRowItem<T>, index: number) => rowType(row.item, index) : undefined,
    [rowType],
  );

  const onVisibleRowsChange = tuning?.onVisibleRowsChange;
  const onViewableItemsChanged = useMemo(
    () =>
      onVisibleRowsChange
        ? ({ viewableItems }: { viewableItems: ViewToken<IRowItem<T>>[] }) =>
            onVisibleRowsChange(
              viewableItems.flatMap((token) =>
                token.index === null ? [] : [{ item: token.item.item, index: token.index }],
              ),
            )
        : undefined,
    [onVisibleRowsChange],
  );

  const visiblePercent = tuning?.visiblePercent;
  const viewabilityConfig = useMemo(
    () =>
      visiblePercent === undefined
        ? undefined
        : { itemVisiblePercentThreshold: visiblePercent },
    [visiblePercent],
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
      <FlashList<IRowItem<T>>
        contentContainerStyle={[
          bottomInset ? { paddingBottom: bottomInset } : undefined,
          contentContainerStyle,
        ]}
        data={rowItems}
        drawDistance={tuning?.drawDistance}
        extraData={tuning?.extraData}
        getItemType={getItemType}
        initialScrollIndex={tuning?.initialIndex}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyExtractor={rowKey}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4">
              <Feedback.Spinner size="small" />
            </View>
          ) : undefined
        }
        maintainVisibleContentPosition={
          tuning?.keepVisiblePosition ? undefined : KEEP_POSITION_OFF
        }
        onEndReached={
          onLoadMore
            ? () => {
                if (hasMore && !loadingMore && !showRefreshing) onLoadMore();
              }
            : undefined
        }
        onEndReachedThreshold={tuning?.loadMoreThreshold ?? 0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        ref={engineRef}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        testID={testID}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

interface ContentProps<T> extends ListScrollProps {
  /** Custom row renderer. Keep it stable with `useCallback`; rows go in `memo`. */
  children?: (item: T, row: IRowItem<T>) => ReactNode;
  withMargin?: boolean;
  tuning?: ListViewTuning<T>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<ListViewHandle>;
}

function Content<T = unknown>({
  children,
  withMargin = true,
  keyboardShouldPersistTaps = "handled",
  keyboardDismissMode = "none",
  testID,
  tuning,
  contentContainerStyle,
  ref,
}: ContentProps<T>) {
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
  } = useListView<T>();

  const bottomInset = useBottomInset();
  const theme = useTheme();
  const onRefreshError = useContext(RefreshErrorContext);
  const engineRef = useRef<FlashListRef<IRowItem<T>>>(null);
  const count = items.length;

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: async (index, options) => {
        if (index < 0 || index >= count) return;
        await engineRef.current?.scrollToIndex({
          index,
          animated: options?.animated ?? true,
          viewPosition: VIEW_POSITION[options?.position ?? "start"],
        });
      },
      scrollToTop: (options) =>
        engineRef.current?.scrollToTop({ animated: options?.animated ?? true }),
      scrollToEnd: (options) =>
        engineRef.current?.scrollToEnd({ animated: options?.animated ?? true }),
    }),
    [count],
  );

  const handleRefresh = useCallback(async () => {
    await refreshListData(onRefresh, onRefreshError, setShowRefreshing);
  }, [onRefresh, onRefreshError, setShowRefreshing]);

  if (isLoading) {
    return <Feedback.Loading message={`Cargando ${name}...`} />;
  }

  if (hasError) {
    return (
      <ScrollView
        contentContainerStyle={[
          {
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: bottomInset,
          },
          contentContainerStyle,
        ]}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        style={{ backgroundColor: theme.bg.page }}
        testID={testID}
      >
        <Feedback.Error message={errorMessage} onBack={onBack} onRetry={onRetry} />
      </ScrollView>
    );
  }

  if (items.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[
          {
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: bottomInset,
          },
          contentContainerStyle,
        ]}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRefresh}
            refreshing={showRefreshing}
          />
        }
        style={{ backgroundColor: theme.bg.page }}
        testID={testID}
      >
        <Feedback.Empty />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg.page }}>
      <Display.CountRecords count={items.length || 0} name={name} />
      <ContentList<T>
        contentContainerStyle={contentContainerStyle}
        contentWithMargin={withMargin}
        engineRef={engineRef}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        testID={testID}
        tuning={tuning}
      >
        {children}
      </ContentList>
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
      <Pressable hitSlop={0} onLongPress={onLongPress} onPress={onPress}>
        {content}
      </Pressable>
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
  /** What the action does, read by screen readers, e.g. "Más opciones". */
  accessibilityLabel?: string;
  testID?: string;
}

/** Grows the target to 48 points tall; sideways it stops at half the gap between actions. */
const ROW_ACTION_SLOP = { top: 8, bottom: 8, left: 2, right: 2 } as const;

/** Compact icon action inside a row. */
function RowActionButton({
  icon,
  onPress,
  accessibilityLabel,
  testID,
}: RowActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      className="p-1.5 rounded"
      hitSlop={ROW_ACTION_SLOP}
      onPress={onPress}
      testID={testID}
    >
      {icon}
    </Pressable>
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
  Row: RowWithSubComponents,
});

/**
 * Screen container for a collection (list / index / search results).
 * Owns safe-area, the FlashList (pagination + pull-to-refresh), record count, and the
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
 *   ListViewV2.Content           — virtualized body; `children` is an optional custom row renderer,
 *                                  `tuning` the recycling options, `ref` a `ListViewHandle`
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
