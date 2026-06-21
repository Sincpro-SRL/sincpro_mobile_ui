import AddItemIcon from "@sincpro/mobile-ui/icons/AddItemIcon";
import ArrangeCircle from "@sincpro/mobile-ui/icons/ArrangeCircle";
import ArrowDownIcon from "@sincpro/mobile-ui/icons/ArrowDownIcon";
import ArrowUpIcon from "@sincpro/mobile-ui/icons/ArrowUpIcon";
import BoxIcon from "@sincpro/mobile-ui/icons/BoxIcon";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import CalendarIcon from "@sincpro/mobile-ui/icons/CalendarIcon";
import CardIcon from "@sincpro/mobile-ui/icons/CardIcon";
import CashierIcon from "@sincpro/mobile-ui/icons/CashierIcon";
import CreditIcon from "@sincpro/mobile-ui/icons/CreditIcon";
import DuoIcon from "@sincpro/mobile-ui/icons/DuoIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import HomeIconOutlined from "@sincpro/mobile-ui/icons/HomeIconOutlined";
import LogoIcon from "@sincpro/mobile-ui/icons/LogoIcon";
import MoneyReceiveIcon from "@sincpro/mobile-ui/icons/MoneyReceiveIcon";
import OdooIcon from "@sincpro/mobile-ui/icons/OdooIcon";
import PinIcon from "@sincpro/mobile-ui/icons/PinIcon";
import PrinterIcon from "@sincpro/mobile-ui/icons/PrinterIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import SinpeIcon from "@sincpro/mobile-ui/icons/SinpeIcon";
import ToggleOffIcon from "@sincpro/mobile-ui/icons/ToggleOffIcon";
import WalletMoneyIcon from "@sincpro/mobile-ui/icons/WalletMoneyIcon";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";

const meta: Meta = { title: "Icons" };
export default meta;

const ICONS = [
  { name: "AddItem", Icon: AddItemIcon },
  { name: "ArrangeCircle", Icon: ArrangeCircle },
  { name: "ArrowDown", Icon: ArrowDownIcon },
  { name: "ArrowUp", Icon: ArrowUpIcon },
  { name: "Box", Icon: BoxIcon },
  { name: "BoxTime", Icon: BoxTimeIcon },
  { name: "Calendar", Icon: CalendarIcon },
  { name: "Card", Icon: CardIcon },
  { name: "Cashier", Icon: CashierIcon },
  { name: "Credit", Icon: CreditIcon },
  { name: "Duo", Icon: DuoIcon },
  { name: "Home", Icon: HomeIcon },
  { name: "HomeOutlined", Icon: HomeIconOutlined },
  { name: "Logo", Icon: LogoIcon },
  { name: "MoneyReceive", Icon: MoneyReceiveIcon },
  { name: "Odoo", Icon: OdooIcon },
  { name: "Pin", Icon: PinIcon },
  { name: "Printer", Icon: PrinterIcon },
  { name: "Profile", Icon: ProfileIcon },
  { name: "Settings", Icon: SettingsIcon },
  { name: "Sinpe", Icon: SinpeIcon },
  { name: "ToggleOff", Icon: ToggleOffIcon },
  { name: "WalletMoney", Icon: WalletMoneyIcon },
];

export const Grid: StoryObj = {
  render: () => (
    <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
      {ICONS.map(({ name, Icon }) => (
        <View key={name} style={{ alignItems: "center", width: 72, gap: 4 }}>
          <Icon size={28} />
          <Typography.Text variant="caption">{name}</Typography.Text>
        </View>
      ))}
    </ScrollView>
  ),
};
