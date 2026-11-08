import { jest, test } from "@jest/globals";
import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { OverlayHost } from "@sincpro/mobile-ui/Dialog/OverlayHost";
import { Display, ICON_NAMES } from "@sincpro/mobile-ui/Display";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { fireEvent, screen } from "@testing-library/react-native";
import { memo, useCallback, useState } from "react";
import { Text, View } from "react-native";
import { measureRenders } from "reassure";

jest.unmock("@sincpro/mobile-ui/Dialog/SheetSurface");
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

test("200 plain texts", async () => {
  await measureRenders(
    <View>
      {Array.from({ length: 200 }, (_, index) => (
        <Typography.Text key={index}>{`Fila ${index}`}</Typography.Text>
      ))}
    </View>,
  );
});

test("200 icons", async () => {
  await measureRenders(
    <View>
      {Array.from({ length: 200 }, (_, index) => (
        <Display.Icon key={index} name={ICON_NAMES[index % ICON_NAMES.length]} size={20} />
      ))}
    </View>,
  );
});

function SheetScreen() {
  const [open, setOpen] = useState(false);
  return (
    <OverlayHost>
      <Actions.Button onPress={() => setOpen(true)} title="Abrir" />
      <Sheet onClose={() => setOpen(false)} title="Detalle" visible={open}>
        <Text>Contenido</Text>
      </Sheet>
    </OverlayHost>
  );
}

test("200 amounts", async () => {
  await measureRenders(
    <View>
      {Array.from({ length: 200 }, (_, index) => (
        <Display.Monetary currencySymbol="Bs" key={index} value={index * 37.5} />
      ))}
    </View>,
  );
});

// Reassure reports 2 "redundant updates" here, and they are expected: when the screen
// sets `visible`, the portal commits `null` (no visible change) and the host draws the
// sheet in a nested update of the same commit, before paint. See docs/GOTCHAS.md.
test("open and close a sheet in the host", async () => {
  await measureRenders(<SheetScreen />, {
    scenario: async (view: typeof screen) => {
      await fireEvent.press(view.getByText("Abrir"));
      const close = view.getAllByLabelText("Cerrar", { includeHiddenElements: true });
      await fireEvent.press(close[close.length - 1]);
    },
  });
});

type Row = { id: string; name: string };
const ROWS: Row[] = Array.from({ length: 100 }, (_, index) => ({
  id: `row-${index}`,
  name: `Registro ${index}`,
}));

const RowItem = memo(function RowItem({
  row,
  onPick,
}: {
  row: Row;
  onPick: (id: string) => void;
}) {
  return (
    <Typography.Text onPress={() => onPick(row.id)} testID={row.id}>
      {row.name}
    </Typography.Text>
  );
});

function ListScreen() {
  const [picked, setPicked] = useState("");
  const pick = useCallback((id: string) => setPicked(id), []);
  return (
    <View>
      <Typography.Text testID="picked">{picked}</Typography.Text>
      {ROWS.map((row) => (
        <RowItem key={row.id} onPick={pick} row={row} />
      ))}
    </View>
  );
}

test("selecting re-renders the screen, not the 100 memoized rows", async () => {
  await measureRenders(<ListScreen />, {
    scenario: async (view: typeof screen) => {
      await fireEvent.press(view.getByTestId("row-3", { includeHiddenElements: true }));
      await fireEvent.press(view.getByTestId("row-7", { includeHiddenElements: true }));
    },
  });
});
