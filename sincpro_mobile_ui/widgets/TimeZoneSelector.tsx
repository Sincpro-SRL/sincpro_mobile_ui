import { Display, Form } from "@sincpro/mobile-ui/index";
import { theme } from "@sincpro/mobile-ui/theme/useTheme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { TimezoneLocale } from "@sincpro/mobile-ui/utils/timezone";
import { TimeZoneSelectorModal } from "@sincpro/mobile-ui/widgets/TimeZoneSelectorModal";
import { useState } from "react";
import { View } from "react-native";

interface TimeZoneSelectorProps {
  onSelect?: (tz: TimezoneLocale) => void;
  timezone?: string | null;
}

/**
 * @deprecated Domain/region-coupled (hardcoded LatAm timezones + Spanish copy); relocated
 * to the core. Import from `@sincpro/mobile/ui/components/molecules` instead. Kept here for
 * backwards compatibility and removed in the next major.
 */
export function TimeZoneSelector({ onSelect, timezone }: TimeZoneSelectorProps) {
  const [currentTimezone, setCurrentTimezone] = useState(timezone);
  const [selectorVisible, setSelectorVisible] = useState(false);

  function handleTimezoneSelected(tz: TimezoneLocale) {
    setCurrentTimezone(tz.timezone);
    onSelect?.(tz);
  }

  const displayTimezone = currentTimezone
    ? currentTimezone.replace(/_/g, " ").replace("America/", "")
    : "No configurada";

  return (
    <View className="bg-bg-muted rounded-xl p-5 my-2.5 shadow-sm">
      <View className="flex-row items-start">
        <Display.Icon
          color={currentTimezone ? theme.info : theme.text.tertiary}
          name="schedule"
          size={35}
          type="material"
        />
        <View className="ml-2.5 flex-1">
          <Typography.Text className="text-base mb-1" semibold>
            Zona Horaria
          </Typography.Text>

          {currentTimezone ? (
            <View className="mt-2 bg-white rounded-lg p-3">
              <Typography.Text className="text-text-primary" semibold>
                {displayTimezone}
              </Typography.Text>
              <Typography.Text className="text-text-tertiary text-xs">
                {currentTimezone}
              </Typography.Text>

              <View className="flex-row gap-2 mt-2">
                <Form.Button
                  onPress={() => setSelectorVisible(true)}
                  size="small"
                  title="Cambiar"
                  variant="outline"
                />
              </View>
            </View>
          ) : (
            <>
              <Typography.Text className="text-text-secondary mb-2">
                Selecciona una zona horaria
              </Typography.Text>
              <Form.Button
                onPress={() => setSelectorVisible(true)}
                size="small"
                title="Seleccionar Zona Horaria"
              />
            </>
          )}
        </View>
      </View>

      <TimeZoneSelectorModal
        currentTimezone={currentTimezone}
        onClose={() => setSelectorVisible(false)}
        onSelect={handleTimezoneSelected}
        visible={selectorVisible}
      />
    </View>
  );
}
