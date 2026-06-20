import ArrangeCircleIcon from "@sincpro/mobile-ui/icons/ArrangeCircle";
import CardIcon from "@sincpro/mobile-ui/icons/CardIcon";
import CreditIcon from "@sincpro/mobile-ui/icons/CreditIcon";
import MoneyReceiveIcon from "@sincpro/mobile-ui/icons/MoneyReceiveIcon";
import SinpeIcon from "@sincpro/mobile-ui/icons/SinpeIcon";
import type React from "react";

export type IconLabel = { icon: React.ComponentType<any>; label: string };
const paymentMethodMap: { prefix: string; icon: React.ComponentType<any>; label: string }[] =
  [
    { prefix: "créd", icon: CreditIcon, label: "Crédito" },
    { prefix: "cred", icon: CreditIcon, label: "Crédito" },
    { prefix: "tar", icon: CardIcon, label: "Tarjeta" },
    { prefix: "trans", icon: ArrangeCircleIcon, label: "Transferencia" },
    { prefix: "ef", icon: MoneyReceiveIcon, label: "Efectivo" },
    { prefix: "sinpe", icon: SinpeIcon, label: "Sinpe Móvil" },
    { prefix: "ban", icon: ArrangeCircleIcon, label: "Banco" },
  ];

export function getIcon(name?: string): IconLabel {
  if (!name) return { icon: CardIcon, label: "Otro" };
  const cleaned = name.trim().toLowerCase();
  const match = paymentMethodMap.find((m) => cleaned.startsWith(m.prefix));
  if (match) return { icon: match.icon, label: match.label };
  return { icon: CardIcon, label: "Otro" };
}
