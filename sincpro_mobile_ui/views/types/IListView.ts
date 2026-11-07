import { UICollectionItem, UIItem } from "@sincpro/mobile-ui/views/types/UIItem";
import { ReactNode } from "react";

export type IRowItem<T> = UIItem & {
  item: T;
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

const defaultRowKeys = {
  id: "id",
  rowTitle: "name",
  rowSubtitle: "description",
  readOnly: "readonly",
};

export function toRowItem<T>(item: T, index: number, mapKeys?: RowKeys<T>): IRowItem<T> {
  const mapper = { ...defaultRowKeys, ...mapKeys };

  if (typeof item === "string" || typeof item === "number") {
    return {
      item,
      id: item,
      index,
      rowTitle: String(item),
      rowSubtitle: undefined,
      readonly: false,
    };
  }

  if (typeof item !== "object" || item === null) {
    throw new TypeError("List row items must be strings, numbers or objects");
  }

  const id: unknown = Reflect.get(item, mapper.id ?? defaultRowKeys.id) ?? index;
  if (typeof id !== "string" && typeof id !== "number") {
    throw new TypeError("List row IDs must be strings or numbers");
  }
  const title: unknown = Reflect.get(item, mapper.rowTitle ?? defaultRowKeys.rowTitle);
  const subtitle: unknown = Reflect.get(
    item,
    mapper.rowSubtitle ?? defaultRowKeys.rowSubtitle,
  );

  return {
    item,
    id,
    index,
    rowTitle: String(title ?? "N/A"),
    rowSubtitle: subtitle == null ? undefined : String(subtitle),
    readonly: Boolean(Reflect.get(item, mapper.readOnly ?? defaultRowKeys.readOnly)),
  };
}

export function toRowItems<T>(items: T[], mapKeys?: RowKeys<T>): IRowItem<T>[] {
  return items.map((item, index) => toRowItem(item, index, mapKeys));
}
