import { FlashList } from "@shopify/flash-list";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { ChoiceRow } from "@sincpro/mobile-ui/Form/choice-row";
import { inputTextStyle } from "@sincpro/mobile-ui/Form/input-text";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { matchesSearch } from "@sincpro/mobile-ui/utils/search";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";

export type PickerOption<T extends string | number> = {
  value: T;
  label: string;
  description?: string;
};

export type PickerFieldProps<T extends string | number> = {
  label: string;
  value: T | null;
  onChange: (value: T, option: PickerOption<T>) => void;
  /** Fixed options, filtered on the device by label and description. */
  options?: readonly PickerOption<T>[];
  /** Remote search (customers, products, Odoo name_search). Debounced; stale answers are dropped. */
  search?: (query: string) => Promise<readonly PickerOption<T>[]>;
  /** Shown for a value that is not in the current page of results. */
  selectedLabel?: string;
  placeholder?: string;
  title?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  testID?: string;
};

const SEARCH_DELAY_MS = 250;

/**
 * A field that opens a searchable list: the "selector" pattern every business
 * app repeats (customer, product, payment method). Local or remote options,
 * one virtualized list, the shared overlay sheet.
 */
function PickerField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  search,
  selectedLabel,
  placeholder = "Seleccionar",
  title,
  searchPlaceholder = "Buscar…",
  emptyLabel = "Sin resultados",
  error,
  disabled = false,
  className,
  testID,
}: PickerFieldProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<readonly PickerOption<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<string>();
  const request = useRef(0);

  useEffect(() => {
    if (!open || !search) return;
    const id = ++request.current;
    const timer = setTimeout(() => {
      search(query).then(
        (found) => {
          if (id !== request.current) return;
          setRemote(found);
          setLoading(false);
        },
        (cause: unknown) => {
          if (id !== request.current) return;
          setFailure(
            cause instanceof Error && cause.message.trim()
              ? cause.message
              : "No se pudo buscar. Vuelve a intentarlo.",
          );
          setLoading(false);
        },
      );
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, query, search]);

  const results = useMemo(() => {
    if (search) return remote;
    return (options ?? []).filter((option) =>
      matchesSearch(query, option.label, option.description),
    );
  }, [options, query, remote, search]);

  const current =
    (options ?? remote).find((option) => option.value === value)?.label ?? selectedLabel;

  const startSearch = () => {
    if (!search) return;
    setLoading(true);
    setFailure(undefined);
  };

  const updateQuery = (text: string) => {
    setQuery(text);
    startSearch();
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = useCallback(
    (option: PickerOption<T>) => {
      onChange(option.value, option);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  const renderOption = useCallback(
    ({ item }: { item: PickerOption<T> }) => {
      return (
        <ChoiceRow
          description={item.description}
          label={item.label}
          look="list"
          onPress={() => choose(item)}
          selected={item.value === value}
        />
      );
    },
    [choose, value],
  );

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      <Typography.Text className="text-text-primary" semibold variant="bodySmall">
        {label}
      </Typography.Text>
      <Pressable
        accessibilityHint="Abre la búsqueda de opciones"
        accessibilityLabel={`${label}: ${current ?? placeholder}`}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        className="flex-row items-center gap-3 rounded-lg border border-input bg-bg-card px-3"
        disabled={disabled}
        onPress={() => {
          setOpen(true);
          startSearch();
        }}
        style={{ minHeight: 48, minWidth: 48 }}
      >
        <Typography.Text
          className={cn("flex-1", current ? "text-text-primary" : "text-text-tertiary")}
          style={{ paddingVertical: 12 }}
        >
          {current ?? placeholder}
        </Typography.Text>
        <Icon color={theme.icon.secondary} name="search" size={18} />
      </Pressable>
      {error ? (
        <Typography.Text accessibilityLiveRegion="polite" className="text-danger">
          {error}
        </Typography.Text>
      ) : null}
      <Sheet
        onClose={close}
        scrollable={false}
        snapPoints={["90%"]}
        testID={testID ? `${testID}-sheet` : undefined}
        title={title ?? label}
        visible={open}
      >
        <View style={{ flex: 1, gap: 8 }}>
          <TextInput
            accessibilityLabel={searchPlaceholder}
            autoCorrect={false}
            className="rounded-xl bg-bg-muted px-4 py-3"
            onChangeText={updateQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.text.tertiary}
            returnKeyType="search"
            selectionColor={theme.primary}
            style={[inputTextStyle(), { color: theme.text.primary }]}
            testID={testID ? `${testID}-search` : undefined}
            underlineColorAndroid="transparent"
            value={query}
          />
          {loading ? <ActivityIndicator color={theme.primary} /> : null}
          {failure ? (
            <Typography.Text accessibilityRole="alert" className="text-danger">
              {failure}
            </Typography.Text>
          ) : null}
          <FlashList
            data={results}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            keyExtractor={(option) => String(option.value)}
            ListEmptyComponent={
              loading ? null : (
                <Typography.Text className="py-6 text-center text-text-tertiary">
                  {emptyLabel}
                </Typography.Text>
              )
            }
            maintainVisibleContentPosition={{ disabled: true }}
            renderItem={renderOption}
            style={{ flex: 1 }}
          />
        </View>
      </Sheet>
    </View>
  );
}

export default PickerField;
