import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface ListViewContextValue<T> {
  name: string;
  description?: string;
  items: readonly T[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  readonly: boolean;
  showRefreshing: boolean;
  setShowRefreshing: (value: boolean) => void;
  onRefresh?: () => Promise<void>;
  onRetry?: () => void;
  onPressItem?(item: T): void;
  onDeleteItem?(item: T): void;
  onSearch?: (query: string) => void;
  onBack?: () => void;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  hasMore: boolean;
}

const Context = createContext<ListViewContextValue<unknown> | null>(null);

export function ListViewProvider<T>({
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
  hasMore = true,
  children,
}: {
  name: string;
  description?: string;
  items: readonly T[];
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
  onLoadMore?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
  children: ReactNode;
}) {
  const [showRefreshing, setShowRefreshing] = useState(false);
  const value = useMemo<ListViewContextValue<T>>(
    () => ({
      name,
      description,
      items,
      isLoading,
      hasError,
      errorMessage,
      readonly,
      showRefreshing,
      setShowRefreshing,
      onRefresh,
      onRetry,
      onPressItem,
      onDeleteItem,
      onSearch,
      onBack,
      onLoadMore,
      loadingMore,
      hasMore,
    }),
    [
      name,
      description,
      items,
      isLoading,
      hasError,
      errorMessage,
      readonly,
      showRefreshing,
      onRefresh,
      onRetry,
      onPressItem,
      onDeleteItem,
      onSearch,
      onBack,
      onLoadMore,
      loadingMore,
      hasMore,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useListView<T = unknown>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useListView must be used within ListViewV2");
  }
  return context as ListViewContextValue<T>;
}
