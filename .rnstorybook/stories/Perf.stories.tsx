import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { Display, ICON_NAMES } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import AuthFormView from "@sincpro/mobile-ui/views/AuthFormView";
import FormView from "@sincpro/mobile-ui/views/FormViewV2";
import ListView from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { PerfProbe } from "../perf/PerfProbe";

const meta: Meta = {
  title: "Patterns/Performance/Laboratorio",
  parameters: { layout: "fullscreen", ownsScroll: true, ownsTopInset: true },
  decorators: [
    (Story, context) => (
      <PerfProbe id={context.name}>
        <Story />
      </PerfProbe>
    ),
  ],
};
export default meta;
type Story = StoryObj;

type Order = { id: string; name: string; amount: number; failed: boolean };

const ORDERS: Order[] = Array.from({ length: 500 }, (_, index) => ({
  id: `order-${index}`,
  name: `Pedido ${index + 1}`,
  amount: (index * 37.5) % 9000,
  failed: index % 7 === 0,
}));

const OrderRow = memo(function OrderRow({
  order,
  onOpen,
}: {
  order: Order;
  onOpen: (order: Order) => void;
}) {
  return (
    <Pressable
      accessibilityLabel={order.name}
      className="flex-row items-center gap-3 border-b border-border-light px-4 py-2"
      onPress={() => onOpen(order)}
    >
      <Display.Icon name={order.failed ? "error" : "success"} size={18} />
      <View style={{ flex: 1 }}>
        <Typography.Text semibold>{order.name}</Typography.Text>
        <Display.Monetary value={order.amount} />
      </View>
      <Display.Badge
        label={order.failed ? "Falló" : "Listo"}
        variant={order.failed ? "danger" : "success"}
      />
    </Pressable>
  );
});

/** 500 rows with icon, money and badge; opening one uses the single screen sheet. */
export const LargeList: Story = {
  render: function LargeList() {
    const [selected, setSelected] = useState<Order | null>(null);
    const [open, setOpen] = useState(false);
    const openOrder = useCallback((order: Order) => {
      setSelected(order);
      setOpen(true);
    }, []);
    const renderOrder = useCallback(
      (order: Order) => <OrderRow onOpen={openOrder} order={order} />,
      [openOrder],
    );
    return (
      <ListView.Root items={ORDERS} name="Pedidos" withContainer={false}>
        <ListView.Content<Order> testID="perf-large-list" withMargin={false}>
          {renderOrder}
        </ListView.Content>
        <Sheet onClose={() => setOpen(false)} title={selected?.name} visible={open}>
          <Display.Monetary value={selected?.amount ?? 0} />
        </Sheet>
      </ListView.Root>
    );
  },
};

const OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `Opción ${index + 1}`,
  value: index + 1,
}));

/** 20 fields, 4 selects and 2 date pickers in one keyboard-aware form. */
export const LargeForm: Story = {
  render: function LargeForm() {
    const [texts, setTexts] = useState<string[]>(() => Array.from({ length: 14 }, () => ""));
    const [choices, setChoices] = useState<(number | null)[]>([null, null, null, null]);
    const [dates, setDates] = useState<(Date | null)[]>([null, null]);
    return (
      <FormView.Root item={{ id: "form" }} name="Formulario" withContainer={false}>
        <FormView.Header />
        <FormView.Content withMargin>
          <View style={{ gap: 16, paddingVertical: 16 }}>
            {texts.map((value, index) => (
              <Form.Input
                key={`text-${index}`}
                label={`Campo ${index + 1}`}
                onChangeText={(text) =>
                  setTexts((current) =>
                    current.map((item, at) => (at === index ? text : item)),
                  )
                }
                returnKeyType="next"
                testID={`perf-field-${index}`}
                value={value}
              />
            ))}
            {choices.map((value, index) => (
              <Form.Select
                key={`select-${index}`}
                label={`Selección ${index + 1}`}
                onChange={(next) =>
                  setChoices((current) =>
                    current.map((item, at) => (at === index ? next : item)),
                  )
                }
                options={OPTIONS}
                value={value}
              />
            ))}
            {dates.map((value, index) => (
              <Form.DatePicker
                key={`date-${index}`}
                label={`Fecha ${index + 1}`}
                onChange={(next) =>
                  setDates((current) =>
                    current.map((item, at) => (at === index ? next : item)),
                  )
                }
                value={value}
              />
            ))}
          </View>
        </FormView.Content>
      </FormView.Root>
    );
  },
};

/**
 * Opens and closes a sheet 50 times, then proves the screen still takes taps.
 * Maestro: tap "Iniciar ciclo", wait for "Ciclo completo", tap "Tocar".
 */
export const SheetCycle: Story = {
  render: function SheetCycle() {
    const [open, setOpen] = useState(false);
    const [cycles, setCycles] = useState(0);
    const [running, setRunning] = useState(false);
    const [taps, setTaps] = useState(0);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
      if (!running) return;
      if (cycles >= 50) {
        setRunning(false);
        return;
      }
      timer.current = setTimeout(() => {
        if (open) setCycles((value) => value + 1);
        setOpen((value) => !value);
      }, 350);
      return () => clearTimeout(timer.current);
    }, [cycles, open, running]);

    return (
      <View style={{ flex: 1, gap: 16, padding: 24, justifyContent: "center" }}>
        <Typography.Text accessibilityLiveRegion="polite" testID="perf-cycle-status">
          {running
            ? `Ciclo ${cycles}/50`
            : cycles >= 50
              ? "Ciclo completo"
              : "Listo para medir"}
        </Typography.Text>
        <Actions.Button
          onPress={() => {
            setCycles(0);
            setRunning(true);
          }}
          title="Iniciar ciclo"
        />
        <Actions.Button
          onPress={() => setTaps((value) => value + 1)}
          title={`Tocar (${taps})`}
          variant="secondary"
        />
        <Sheet onClose={() => setOpen(false)} title="Detalle" visible={open}>
          <Typography.Text>Contenido de la sheet</Typography.Text>
        </Sheet>
      </View>
    );
  },
};

/**
 * Swaps two auth forms with the keyboard open, the case where a view unmounts
 * while a touch is active (RN 0.88 lost-tap issue #59519).
 */
export const AuthFlow: Story = {
  render: function AuthFlow() {
    const [screen, setScreen] = useState<"login" | "server">("login");
    const [values, setValues] = useState({ user: "", password: "", server: "" });
    if (screen === "server") {
      return (
        <AuthFormView
          description="Servidor"
          FormNode={
            <View style={{ gap: 16 }}>
              <Form.Input
                label="Servidor"
                look="outline"
                onChangeText={(server) => setValues((current) => ({ ...current, server }))}
                value={values.server}
              />
              <Actions.Button onPress={() => setScreen("login")} title="Volver" />
            </View>
          }
          title="Configurar servidor"
        />
      );
    }
    return (
      <AuthFormView
        description="Acceso"
        FormNode={
          <View style={{ gap: 16 }}>
            <Form.Input
              label="Usuario"
              look="outline"
              onChangeText={(user) => setValues((current) => ({ ...current, user }))}
              value={values.user}
            />
            <Form.Input
              label="Contraseña"
              look="outline"
              onChangeText={(password) => setValues((current) => ({ ...current, password }))}
              secure
              value={values.password}
            />
            <Actions.Button onPress={() => setScreen("server")} title="Servidor" />
          </View>
        }
        title="Ingresar"
      />
    );
  },
};

/** 300 icons: the most repeated component, measured on its own. */
export const ManyIcons: Story = {
  render: function ManyIcons() {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 16 }}>
        {Array.from({ length: 300 }, (_, index) => (
          <Display.Icon key={index} name={ICON_NAMES[index % ICON_NAMES.length]} size={20} />
        ))}
      </View>
    );
  },
};
