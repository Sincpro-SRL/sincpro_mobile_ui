import { FlashList } from "@shopify/flash-list";
import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { TimezoneLocale } from "@sincpro/mobile-ui/utils/timezone";
import { useMemo, useState } from "react";
import { TextInput, View } from "react-native";

interface TimeZoneSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (tz: TimezoneLocale) => void;
  currentTimezone?: string | null;
}

const TIMEZONES_LOCALES: Record<string, TimezoneLocale> = {
  bolivia: { timezone: "America/La_Paz", locale: "es-BO" },
  costaRica: { timezone: "America/Costa_Rica", locale: "es-CR" },
  guatemala: { timezone: "America/Guatemala", locale: "es-GT" },
  argentina: { timezone: "America/Argentina/Buenos_Aires", locale: "es-AR" },
  peru: { timezone: "America/Lima", locale: "es-PE" },
  newYork: { timezone: "America/New_York", locale: "en-US" },
  japon: { timezone: "Asia/Tokyo", locale: "ja-JP" },
};

interface TimezoneItem extends TimezoneLocale {
  label: string;
}

function TimezoneRow({
  item,
  isSelected,
  onSelect,
}: {
  item: TimezoneItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityHint={item.locale}
      accessibilityLabel={item.label}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, selected: isSelected }}
      className="flex-row items-center p-4 border-b border-border-light"
      onPress={onSelect}
      style={{
        minHeight: 64,
        backgroundColor: isSelected ? theme.container.info : theme.bg.card,
      }}
      testID={`timezone-${item.timezone}`}
    >
      <Icon color={isSelected ? theme.info : theme.text.secondary} name="time" size={24} />
      <View className="ml-3 flex-1">
        <Typography.Text semibold>{item.label}</Typography.Text>
        <Typography.Text className="text-text-tertiary text-xs">
          {item.locale}
        </Typography.Text>
      </View>
      {isSelected && (
        <View className="w-6 h-6 rounded-full bg-info items-center justify-center">
          <Icon color={theme.text.inverse} name="check" size={16} />
        </View>
      )}
    </Pressable>
  );
}

function EmptyState() {
  const theme = useTheme();

  return (
    <View className="p-8 items-center justify-center" style={{ minHeight: 200 }}>
      <Icon color={theme.text.tertiary} name="search-empty" size={48} />
      <Typography.Text className="text-text-secondary text-center mt-4">
        {"No se encontraron zonas horarias"}
      </Typography.Text>
    </View>
  );
}

function TimeZoneSelectorModal({
  visible,
  onClose,
  onSelect,
  currentTimezone,
}: TimeZoneSelectorModalProps) {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(
    currentTimezone || null,
  );

  const timezoneList = useMemo<TimezoneItem[]>(() => {
    return Object.values(TIMEZONES_LOCALES).map((tz) => ({
      ...tz,
      label: tz.timezone.replace(/_/g, " ").replace("America/", ""),
    }));
  }, []);

  const filteredTimezones = useMemo(() => {
    if (!query.trim()) return timezoneList;

    const normalizedQuery = query
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return timezoneList.filter(({ label, timezone }) => {
      const normalizedLabel = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedTz = timezone.toLowerCase();
      return (
        normalizedLabel.includes(normalizedQuery) || normalizedTz.includes(normalizedQuery)
      );
    });
  }, [query, timezoneList]);

  function handleConfirm() {
    const selected = timezoneList.find((tz) => tz.timezone === selectedTimezone);
    if (selected) {
      onSelect({ timezone: selected.timezone, locale: selected.locale });
      onClose();
    }
  }

  return (
    <Sheet
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button onPress={onClose} title={"Cancelar"} variant="outline" />
          </View>
          {selectedTimezone && (
            <View className="flex-1">
              <Button onPress={handleConfirm} title={"Confirmar"} variant="primary" />
            </View>
          )}
        </View>
      }
      onClose={onClose}
      scrollable={false}
      snapPoints={["90%"]}
      testID="timezone-sheet"
      title="Zona Horaria"
      visible={visible}
    >
      <View className="flex-1">
        <View className="px-5 pb-3">
          <Typography.Text className="text-text-secondary text-xs mb-3">
            {"Selecciona tu zona horaria"}
          </Typography.Text>
          <TextInput
            accessibilityLabel="Buscar zona horaria"
            className="bg-bg-muted px-4 py-3 rounded-xl"
            onChangeText={setQuery}
            placeholder={"Buscar zona horaria..."}
            placeholderTextColor={theme.text.tertiary}
            selectionColor={theme.primary}
            style={{ color: theme.text.primary }}
            testID="timezone-search"
            underlineColorAndroid="transparent"
            value={query}
          />
        </View>
        <FlashList<TimezoneItem>
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredTimezones}
          extraData={selectedTimezone}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.timezone}
          ListEmptyComponent={EmptyState}
          maintainVisibleContentPosition={{ disabled: true }}
          renderItem={({ item }) => (
            <TimezoneRow
              isSelected={selectedTimezone === item.timezone}
              item={item}
              onSelect={() => setSelectedTimezone(item.timezone)}
            />
          )}
          style={{ flex: 1 }}
          testID="timezone-list"
        />
      </View>
    </Sheet>
  );
}

export { TimeZoneSelectorModal };
