import { ReactNode } from "react";

import { UIItem } from "./UIItem";

export interface IFormView<T> extends UIItem {
  name: string;
  description?: string;
  item?: T;
  isLoading?: boolean;
  isEmpty?: boolean;
  Toolbar?: ReactNode;
  HeaderActionButton?: ReactNode;
  Footer?: ReactNode;
  FormComponent?: React.ComponentType<{
    item: T;
    readonly?: boolean;
    isLoading?: boolean;
    onSubmit?: () => void;
  }>;
  Groups?: ReactNode[];
  onBack?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
}
