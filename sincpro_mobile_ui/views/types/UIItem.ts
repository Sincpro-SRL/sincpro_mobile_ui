interface UIItemActions {
  onPress?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  onDuplicate?: () => void;
}

export interface UIItem extends UIItemActions {
  readonly?: boolean;
}

interface UICollectionActions<T> {
  onSearch?: (query: string) => void | Promise<void>;
  onPressItem?: (item: T) => void | Promise<void>;
  onDeleteItem?: (item: T) => void | Promise<void>;
  onUpdateItem?: (item: T) => void | Promise<void>;
  onDuplicateItem?: (item: T) => void | Promise<void>;
  onSelectItem?: (item: T) => void | Promise<void>;
}

export interface UICollectionItem<T> extends UICollectionActions<T> {
  readonly?: boolean;
}
