import { createContext, ReactNode, useContext, useState } from "react";

interface ListViewContextValue<T> {
  name: string;
  description?: string;
  items: T[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  readonly: boolean;
  showRefreshing: boolean;
  setShowRefreshing: (value: boolean) => void;
  onRefresh?: () => Promise<void>;
  onRetry?: () => void;
  onPressItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
  onSearch?: (query: string) => void;
  onBack?: () => void;
}

const Context = createContext<ListViewContextValue<any> | null>(null);

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
  children,
}: {
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
  children: ReactNode;
}) {
  const [showRefreshing, setShowRefreshing] = useState(false);

  return (
    <Context.Provider
      value={{
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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useListView<T>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useListView must be used within ListViewV2");
  }
  return context as ListViewContextValue<T>;
}
