import { ReactNode } from "react";

import { UICollectionItem, UIItem } from "./UIItem";

export type IRowItem<T> = T &
  UIItem & {
    id: string | number;
    index: number;
    rowTitle: string;
    rowSubtitle?: string;
  };

export interface IRowItemProps<T> extends UIItem {
  item: IRowItem<T> | T;
}

export interface IListView<T> extends UICollectionItem<T> {
  name: string;
  description?: string;
  items: T[];
  isLoading?: boolean;
  onRefresh?: () => void | Promise<void>;
  onBack?: () => void | Promise<void>;
  ItemComponent?: React.ComponentType<IRowItemProps<T>>;
  ToolbarComponent?: ReactNode;
  SearchComponent?: ReactNode;
  ActionComponent?: ReactNode;
  FooterComponent?: ReactNode;
  FloatingButtonComponent?: ReactNode;
  EmptyComponent?: ReactNode;
}

export type RowKeys<T> = Partial<{
  id?: keyof T;
  rowTitle?: keyof T;
  rowSubtitle?: keyof T;
  readOnly?: keyof T;
}>;

const defaultRowKeys: RowKeys<any> = {
  id: "id",
  rowTitle: "name",
  rowSubtitle: "description",
  readOnly: "readonly",
};

export function toRowItem<T>(item: T, index: number, mapKeys?: RowKeys<T>): IRowItem<T> {
  let mapper: RowKeys<T> = {};
  if (!mapKeys) {
    mapper = defaultRowKeys as RowKeys<T>;
  } else {
    mapper = { ...defaultRowKeys, ...mapKeys } as RowKeys<T>;
  }

  if (typeof item === "string" || typeof item === "number") {
    return {
      id: item,
      rowTitle: String(item),
      rowSubtitle: undefined,
      readonly: false,
    } as IRowItem<T>;
  }

  const rowItem = Object.create(Object.getPrototypeOf(item));
  Object.assign(rowItem, item, {
    id: item[mapper.id!] || "N/A",
    index: index,
    rowTitle: item[mapper.rowTitle!] || "N/A",
    rowSubtitle: item[mapper.rowSubtitle!] || undefined,
    readonly: item[mapper.readOnly!] || false,
  });

  return rowItem as IRowItem<T>;
}

export function toRowItems<T>(items: T[], mapKeys?: RowKeys<T>): IRowItem<T>[] {
  return items.map((item, index) => toRowItem(item, index, mapKeys));
}
