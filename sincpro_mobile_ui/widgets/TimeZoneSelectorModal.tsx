import { BottomSheet } from "@sincpro/mobile-ui/Dialog/BottomSheet";
import { Display, Form } from "@sincpro/mobile-ui/index";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { TimezoneLocale } from "@sincpro/mobile-ui/utils/timezone";
import { useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

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
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex-row items-center p-4 border-b border-gray-100 ${
        isSelected ? "bg-blue-50" : "bg-white"
      }`}
      onPress={onSelect}
    >
      <Display.Icon
        color={isSelected ? theme.info : theme.text.secondary}
        name="schedule"
        size={24}
        type="material"
      />
      <View className="ml-3 flex-1">
        <Typography.Text semibold>{item.label}</Typography.Text>
        <Typography.Text className="text-gray-400 text-xs">{item.locale}</Typography.Text>
      </View>
      {isSelected && (
        <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
          <Display.Icon color={theme.text.inverse} name="check" size={16} type="material" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View className="p-8 items-center justify-center" style={{ minHeight: 200 }}>
      <Display.Icon color={theme.text.tertiary} name="search-off" size={48} type="material" />
      <Typography.Text className="text-gray-500 text-center mt-4">
        {"No se encontraron zonas horarias"}
      </Typography.Text>
    </View>
  );
}

/**
 * @deprecated Domain/region-coupled (hardcoded LatAm timezones + Spanish copy); relocated
 * to the core. Import from `@sincpro/mobile/ui/components/molecules` instead. Kept here for
 * backwards compatibility and removed in the next major.
 */
function TimeZoneSelectorModal({
  visible,
  onClose,
  onSelect,
  currentTimezone,
}: TimeZoneSelectorModalProps) {
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
    <BottomSheet.Root onClose={onClose} size="large" visible={visible}>
      <BottomSheet.Header>
        <View className="px-5 pb-3">
          <Typography.Text bold variant="subtitle">
            {"Zona Horaria"}
          </Typography.Text>
          <Typography.Text className="text-gray-500 text-xs">
            {"Selecciona tu zona horaria"}
          </Typography.Text>
        </View>
        <View className="px-5 pb-3">
          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-xl"
            onChangeText={setQuery}
            placeholder={"Buscar zona horaria..."}
            placeholderTextColor={theme.text.tertiary}
            value={query}
          />
        </View>
      </BottomSheet.Header>

      <BottomSheet.Content scrollable>
        {filteredTimezones.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredTimezones}
            keyExtractor={(item) => item.timezone}
            renderItem={({ item }) => (
              <TimezoneRow
                isSelected={selectedTimezone === item.timezone}
                item={item}
                onSelect={() => setSelectedTimezone(item.timezone)}
              />
            )}
            scrollEnabled={false}
          />
        )}
      </BottomSheet.Content>

      <BottomSheet.Actions layout="horizontal">
        <View className="flex-1">
          <Form.Button onPress={onClose} title={"Cancelar"} variant="outline" />
        </View>
        {selectedTimezone && (
          <View className="flex-1">
            <Form.Button onPress={handleConfirm} title={"Confirmar"} variant="primary" />
          </View>
        )}
      </BottomSheet.Actions>
    </BottomSheet.Root>
  );
}

export { TimeZoneSelectorModal };
