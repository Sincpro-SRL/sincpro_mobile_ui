import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
}
export interface SearchSuggestionsProps {
  items: readonly SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyLabel?: string;
}
export default function SearchSuggestions({
  items,
  onSelect,
  loading,
  error,
  onRetry,
  emptyLabel = "Sin sugerencias",
}: SearchSuggestionsProps) {
  return (
    <View className="gap-1 border-b border-border-light py-2">
      {loading ? (
        <Typography.Text accessibilityLiveRegion="polite">
          Buscando sugerencias…
        </Typography.Text>
      ) : error ? (
        <>
          <Typography.Text accessibilityLiveRegion="polite" className="text-danger">
            {error}
          </Typography.Text>
          {onRetry ? (
            <Pressable onPress={onRetry} style={{ minHeight: 48, justifyContent: "center" }}>
              <Typography.Text className="text-text-accent">
                Reintentar sugerencias
              </Typography.Text>
            </Pressable>
          ) : null}
        </>
      ) : !items.length ? (
        <Typography.Text accessibilityLiveRegion="polite" className="text-text-secondary">
          {emptyLabel}
        </Typography.Text>
      ) : (
        items.map((item) => (
          <Pressable
            accessibilityLabel={
              item.description ? `${item.label}. ${item.description}` : item.label
            }
            className="px-3 py-2"
            key={item.id}
            onPress={() => onSelect(item)}
            style={{ minHeight: 48, justifyContent: "center" }}
          >
            <Typography.Text variant="bodyReadable">{item.label}</Typography.Text>
            {item.description ? (
              <Typography.Text className="text-text-secondary" variant="bodyLarge">
                {item.description}
              </Typography.Text>
            ) : null}
          </Pressable>
        ))
      )}
    </View>
  );
}
