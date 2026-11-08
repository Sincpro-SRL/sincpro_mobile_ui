import {
  ThemedActivityIndicator,
  type ThemeTokens,
  useTheme,
} from "@sincpro/mobile-ui/theme";
import { fontFamilies } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const parseDeepJson = (value: any): any => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parseDeepJson(parsed);
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map(parseDeepJson);
  }

  if (value && typeof value === "object") {
    const result: any = {};
    for (const key in value) {
      result[key] = parseDeepJson(value[key]);
    }
    return result;
  }

  return value;
};

/** What each fragment is; the theme decides its color, so the viewer reads in dark mode. */
type JsonRole =
  "key" | "string" | "number" | "boolean" | "null" | "punctuation" | "warning" | "text";

function jsonPalette(theme: ThemeTokens): Record<JsonRole, string> {
  return {
    key: theme.info,
    string: theme.success,
    number: theme.warning,
    boolean: theme.accent,
    null: theme.text.tertiary,
    punctuation: theme.text.secondary,
    warning: theme.warning,
    text: theme.text.primary,
  };
}

const MAX_JSON_SIZE = 500_000; // 500KB límite
const MAX_LINES = 500; // Máximo 500 líneas con colores

interface JsonLine {
  text: string;
  role: JsonRole;
}

function parseJsonToColoredLines(jsonString: string): JsonLine[] {
  // Guard 1: check size
  if (jsonString.length > MAX_JSON_SIZE) {
    return [
      {
        text: `⚠️ JSON muy grande (${(jsonString.length / 1024).toFixed(1)}KB)\n\n`,
        role: "warning",
      },
      { text: "Mostrando como texto plano por performance...\n\n", role: "punctuation" },
      { text: jsonString, role: "text" },
    ];
  }

  const lines = jsonString.split("\n");

  // Guard 2: check line count
  if (lines.length > MAX_LINES) {
    return [
      {
        text: `⚠️ JSON muy largo (${lines.length} líneas)\n\n`,
        role: "warning",
      },
      { text: "Mostrando como texto plano por performance...\n\n", role: "punctuation" },
      { text: jsonString, role: "text" },
    ];
  }

  const coloredLines: JsonLine[] = [];

  lines.forEach((line) => {
    // Every `"key": value` line is colored, including the last one of an object (no comma).
    const keyMatch = line.match(/^(\s*)"([^"]+)":\s*(.+)$/);
    if (keyMatch) {
      const indent = keyMatch[1];
      const key = keyMatch[2];
      const valueStr = keyMatch[3];

      coloredLines.push(
        { text: indent, role: "punctuation" },
        { text: `"${key}"`, role: "key" },
        { text: ": ", role: "punctuation" },
      );

      if (valueStr.startsWith('"')) {
        coloredLines.push({ text: valueStr + "\n", role: "string" });
      } else if (!isNaN(Number(valueStr.replace(",", "")))) {
        coloredLines.push({ text: valueStr + "\n", role: "number" });
      } else if (valueStr.startsWith("true") || valueStr.startsWith("false")) {
        coloredLines.push({ text: valueStr + "\n", role: "boolean" });
      } else if (valueStr.startsWith("null")) {
        coloredLines.push({ text: valueStr + "\n", role: "null" });
      } else {
        coloredLines.push({ text: valueStr + "\n", role: "punctuation" });
      }
      return;
    }

    coloredLines.push({ text: line + "\n", role: "punctuation" });
  });

  return coloredLines;
}

const JsonPreview = ({ selectedJson }: { selectedJson: string }) => {
  const palette = jsonPalette(useTheme());
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard 3: format with a robust try-catch
  const formattedJson = useMemo(() => {
    if (!selectedJson || selectedJson.trim() === "") {
      return "{}";
    }

    try {
      const parsed = JSON.parse(selectedJson);
      const cleaned = parseDeepJson(parsed);
      return JSON.stringify(cleaned, null, 2);
    } catch (error) {
      console.warn("[JSONViewer] Error parsing JSON:", error);
      return selectedJson; // Mostrar original si falla
    }
  }, [selectedJson]);

  // Guard 4: colorize with processing control
  const coloredLines = useMemo<JsonLine[]>(() => {
    try {
      return parseJsonToColoredLines(formattedJson);
    } catch (error) {
      console.warn("[JSONViewer] Error coloring JSON:", error);
      return [{ text: formattedJson, role: "text" }];
    }
  }, [formattedJson]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsProcessing(true);
    const t = setTimeout(() => setIsProcessing(false), 50);
    return () => clearTimeout(t);
  }, [formattedJson]);

  // Guard 5: show loading while processing large JSON
  if (isProcessing && formattedJson.length > 50_000) {
    return (
      <View className="p-4 items-center justify-center min-h-[200px]">
        <ThemedActivityIndicator size="large" />
        <Typography.Text className="mt-2 text-text-secondary" variant="bodySmall">
          Procesando JSON...
        </Typography.Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Text
        selectable
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: 13,
          lineHeight: 18,
        }}
      >
        {coloredLines.map((line, index) => (
          <Text key={index} style={{ color: palette[line.role] }}>
            {line.text}
          </Text>
        ))}
      </Text>
    </View>
  );
};

export default JsonPreview;
