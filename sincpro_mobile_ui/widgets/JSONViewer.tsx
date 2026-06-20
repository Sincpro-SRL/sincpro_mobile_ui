import { ThemedActivityIndicator } from "@sincpro/mobile-ui/theme";
import React, { useMemo, useState } from "react";
import { Platform, Text, View } from "react-native";

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

const JSON_COLORS = {
  key: "#0066CC",
  string: "#008000",
  number: "#FF8C00",
  boolean: "#9966CC",
  null: "#999999",
  punctuation: "#666666",
};

const MAX_JSON_SIZE = 500_000; // 500KB límite
const MAX_LINES = 500; // Máximo 500 líneas con colores

interface JsonLine {
  text: string;
  color: string;
}

function parseJsonToColoredLines(jsonString: string): JsonLine[] {
  // Protección 1: Verificar tamaño
  if (jsonString.length > MAX_JSON_SIZE) {
    return [
      {
        text: `⚠️ JSON muy grande (${(jsonString.length / 1024).toFixed(1)}KB)\n\n`,
        color: "#FF6600",
      },
      { text: "Mostrando como texto plano por performance...\n\n", color: "#666666" },
      { text: jsonString, color: "#333333" },
    ];
  }

  const lines = jsonString.split("\n");

  // Protección 2: Verificar cantidad de líneas
  if (lines.length > MAX_LINES) {
    return [
      {
        text: `⚠️ JSON muy largo (${lines.length} líneas)\n\n`,
        color: "#FF6600",
      },
      { text: "Mostrando como texto plano por performance...\n\n", color: "#666666" },
      { text: jsonString, color: "#333333" },
    ];
  }

  const coloredLines: JsonLine[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (
      !trimmed ||
      trimmed === "{" ||
      trimmed === "}" ||
      trimmed === "[" ||
      trimmed === "]" ||
      trimmed === "," ||
      trimmed.endsWith(",")
    ) {
      const keyMatch = line.match(/^(\s*)"([^"]+)":\s*(.+)$/);

      if (keyMatch) {
        const indent = keyMatch[1];
        const key = keyMatch[2];
        const valueStr = keyMatch[3];

        coloredLines.push(
          { text: indent, color: JSON_COLORS.punctuation },
          { text: `"${key}"`, color: JSON_COLORS.key },
          { text: ": ", color: JSON_COLORS.punctuation },
        );

        if (valueStr.startsWith('"')) {
          coloredLines.push({ text: valueStr + "\n", color: JSON_COLORS.string });
        } else if (!isNaN(Number(valueStr.replace(",", "")))) {
          coloredLines.push({ text: valueStr + "\n", color: JSON_COLORS.number });
        } else if (valueStr.startsWith("true") || valueStr.startsWith("false")) {
          coloredLines.push({ text: valueStr + "\n", color: JSON_COLORS.boolean });
        } else if (valueStr.startsWith("null")) {
          coloredLines.push({ text: valueStr + "\n", color: JSON_COLORS.null });
        } else {
          coloredLines.push({ text: valueStr + "\n", color: JSON_COLORS.punctuation });
        }
        return;
      }
    }

    coloredLines.push({ text: line + "\n", color: JSON_COLORS.punctuation });
  });

  return coloredLines;
}

const JsonPreview = ({ selectedJson }: { selectedJson: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Protección 3: Formatear con try-catch robusto
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

  // Protección 4: Colorear con control de procesamiento
  const coloredLines = useMemo(() => {
    setIsProcessing(true);

    try {
      return parseJsonToColoredLines(formattedJson);
    } catch (error) {
      console.warn("[JSONViewer] Error coloring JSON:", error);
      // Fallback a texto plano si falla el coloreado
      return [{ text: formattedJson, color: "#333333" }];
    } finally {
      // Pequeño delay para que el loading sea visible si es necesario
      setTimeout(() => setIsProcessing(false), 50);
    }
  }, [formattedJson]);

  // Protección 5: Mostrar loading mientras procesa JSONs grandes
  if (isProcessing && formattedJson.length > 50_000) {
    return (
      <View className="p-4 items-center justify-center min-h-[200px]">
        <ThemedActivityIndicator size="large" />
        <Text className="mt-2 text-text-secondary text-sm">Procesando JSON...</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Text
        selectable
        style={{
          fontFamily: Platform.select({
            ios: "Courier",
            android: "monospace",
            default: "Courier",
          }),
          fontSize: 13,
          lineHeight: 18,
        }}
      >
        {coloredLines.map((line, index) => (
          <Text key={index} style={{ color: line.color }}>
            {line.text}
          </Text>
        ))}
      </Text>
    </View>
  );
};

export default JsonPreview;
