import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import { FilterButtonGroup } from "@sincpro/mobile-ui/Actions/Actions.FilterButton";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import SearchHistory, {
  type SearchHistoryProps,
} from "@sincpro/mobile-ui/Display/Display.SearchHistory";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { View } from "react-native";

import SearchBar, { type SearchBarProps } from "./Navigation.SearchBar";
import SearchSuggestions, {
  type SearchSuggestionsProps,
} from "./Navigation.SearchSuggestions";

export interface SearchRootProps {
  children: ReactNode;
  className?: string;
  testID?: string;
}

function Root({ children, className, testID }: SearchRootProps) {
  return (
    <View className={cn("gap-3", className)} testID={testID}>
      {children}
    </View>
  );
}

function Field(props: SearchBarProps) {
  return <SearchBar {...props} />;
}

export interface SearchFiltersProps {
  children: ReactNode;
  className?: string;
  testID?: string;
}

function Filters({ children, className, testID }: SearchFiltersProps) {
  return (
    <FilterButtonGroup className={className} layout="scroll" testID={testID}>
      {children}
    </FilterButtonGroup>
  );
}

export interface SearchFilterSheetProps {
  children: ReactNode;
  activeCount?: number;
  title?: string;
  triggerLabel?: string;
  applyLabel?: string;
  clearLabel?: string;
  onApply: () => void;
  onClear?: () => void;
  testID?: string;
}

function FilterSheet({
  children,
  activeCount = 0,
  title = "Filtros",
  triggerLabel = "Filtros",
  applyLabel = "Aplicar",
  clearLabel = "Limpiar",
  onApply,
  onClear,
  testID,
}: SearchFilterSheetProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const countLabel = activeCount > 0 ? `, ${activeCount} activos` : "";

  return (
    <>
      <Pressable
        accessibilityLabel={`${triggerLabel}${countLabel}`}
        accessibilityRole="button"
        className="min-h-11 flex-row items-center justify-center gap-2 self-start rounded-full bg-bg-muted px-4"
        onPress={() => setVisible(true)}
        style={{ minHeight: 44 }}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <Icon color={theme.icon.secondary} name="options-outline" size={18} />
        <Typography.Text className="text-text-primary" variant="buttonSmall">
          {triggerLabel}
        </Typography.Text>
        {activeCount > 0 ? (
          <Typography.Text
            accessibilityLabel={`${activeCount} filtros activos`}
            className="text-text-accent"
            variant="caption"
          >
            {activeCount}
          </Typography.Text>
        ) : null}
      </Pressable>
      <Sheet
        dismissOnBackdrop
        footer={
          <View className="flex-row gap-3">
            {onClear ? (
              <View className="flex-1">
                <Button onPress={onClear} title={clearLabel} variant="secondary" />
              </View>
            ) : null}
            <View className="flex-1">
              <Button
                onPress={() => {
                  onApply();
                  setVisible(false);
                }}
                title={applyLabel}
              />
            </View>
          </View>
        }
        onClose={() => setVisible(false)}
        showCloseButton
        testID={testID ? `${testID}-sheet` : undefined}
        title={title}
        visible={visible}
      >
        {children}
      </Sheet>
    </>
  );
}

function History(props: SearchHistoryProps) {
  return <SearchHistory {...props} />;
}

function Suggestions(props: SearchSuggestionsProps) {
  return <SearchSuggestions {...props} />;
}

const Search = {
  Root,
  Field,
  Filters,
  FilterSheet,
  History,
  Suggestions,
};

export type { SearchBarProps, SearchHistoryProps, SearchSuggestionsProps };
export default Search;
