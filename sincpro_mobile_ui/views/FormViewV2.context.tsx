import { createContext, ReactNode, useContext, useState } from "react";

interface FormViewContextValue<T> {
  name: string;
  description?: string;
  item: T | null;
  isLoading: boolean;
  isEmpty: boolean;
  hasError: boolean;
  errorMessage?: string;
  readonly: boolean;
  showRefreshing: boolean;
  setShowRefreshing: (value: boolean) => void;
  onRefresh?: () => Promise<void>;
  onRetry?: () => void;
  onBack?: () => void;
}

const Context = createContext<FormViewContextValue<any> | null>(null);

export function FormViewProvider<T>({
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
  children,
}: {
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
  children: ReactNode;
}) {
  const [showRefreshing, setShowRefreshing] = useState(false);

  return (
    <Context.Provider
      value={{
        name,
        description,
        item,
        isLoading,
        isEmpty,
        hasError,
        errorMessage,
        readonly,
        showRefreshing,
        setShowRefreshing,
        onRefresh,
        onRetry,
        onBack,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useFormView<T>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useFormView must be used within FormViewV2");
  }
  return context as FormViewContextValue<T>;
}
