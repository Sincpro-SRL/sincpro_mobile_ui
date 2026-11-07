import {
  FilterButton,
  FilterButtonGroup,
} from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import SearchBar, {
  type SearchBarProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SearchBar";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useWindowDimensions, View } from "react-native";

export interface FilterBarOption {
  id: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
}

export interface FilterBarProps {
  filters: readonly FilterBarOption[];
  onFilterPress: (id: string) => void;
  search?: SearchBarProps;
  onOpenFilters?: () => void;
  filtersLabel?: string;
  onClearFilters?: () => void;
  clearLabel?: string;
  resultsLabel?: string;
  layout?: "auto" | "scroll" | "wrap";
  className?: string;
  testID?: string;
}

export function FilterBar({
  filters,
  onFilterPress,
  search,
  onOpenFilters,
  filtersLabel = "Más filtros",
  onClearFilters,
  clearLabel = "Limpiar filtros",
  resultsLabel,
  layout = "auto",
  className,
  testID,
}: FilterBarProps) {
  const { fontScale } = useWindowDimensions();
  const selectedCount = filters.filter((filter) => filter.selected).length;
  const filterLayout = layout === "auto" ? (fontScale > 1.3 ? "wrap" : "scroll") : layout;

  return (
    <View className={cn("gap-2", className)} testID={testID}>
      {search || onOpenFilters ? (
        <View className="flex-row items-center gap-2">
          {search ? (
            <View className="flex-1 min-w-0">
              <SearchBar {...search} />
            </View>
          ) : null}
          {onOpenFilters ? (
            <IconButton
              accessibilityLabel={filtersLabel}
              icon="sliders"
              onPress={onOpenFilters}
            />
          ) : null}
        </View>
      ) : null}
      <FilterButtonGroup
        className="p-0"
        layout={filterLayout}
        testID={testID ? `${testID}-options` : undefined}
      >
        {filters.map((filter) => (
          <FilterButton
            active={filter.selected}
            disabled={filter.disabled}
            key={filter.id}
            onPress={() => onFilterPress(filter.id)}
            testID={testID ? `${testID}-${filter.id}` : undefined}
            title={filter.label}
            variant="mobile"
          />
        ))}
      </FilterButtonGroup>
      {resultsLabel || (selectedCount > 0 && onClearFilters) ? (
        <View className="flex-row flex-wrap items-center justify-between gap-x-3">
          {resultsLabel ? (
            <Typography.Text
              accessibilityLiveRegion="polite"
              className="text-text-secondary"
              variant="bodyLarge"
            >
              {resultsLabel}
            </Typography.Text>
          ) : null}
          {selectedCount > 0 && onClearFilters ? (
            <Pressable
              accessibilityLabel={clearLabel}
              accessibilityRole="button"
              onPress={onClearFilters}
              style={{ minHeight: 48, minWidth: 48, justifyContent: "center" }}
            >
              <Typography.Text className="text-text-accent" variant="bodyLarge">
                {clearLabel}
              </Typography.Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
