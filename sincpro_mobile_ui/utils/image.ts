import type { ImageProps } from "expo-image";

export type ImageSource = NonNullable<ImageProps["source"]>;

const sharedSourceKeys = new WeakMap<object, number>();
let nextSharedSourceKey = 0;

export function imageSourceKey(source: ImageProps["source"]): string | undefined {
  if (source && typeof source === "object" && "nativeRefType" in source) {
    let key = sharedSourceKeys.get(source);
    if (key === undefined) {
      key = nextSharedSourceKey++;
      sharedSourceKeys.set(source, key);
    }
    return `shared-image-${key}`;
  }
  return JSON.stringify(source);
}
