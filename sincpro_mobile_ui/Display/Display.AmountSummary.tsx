import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { createContext, type ReactNode, useContext } from "react";
import { View } from "react-native";

import Monetary from "./Display.Monetary";

interface AmountSummaryContextValue {
  currencySymbol: string;
}

const AmountSummaryContext = createContext<AmountSummaryContextValue | undefined>(undefined);

export interface AmountSummaryRootProps {
  children: ReactNode;
  currencySymbol: string;
  variant?: "card" | "plain";
  className?: string;
  testID?: string;
}

function Root({
  children,
  currencySymbol,
  variant = "card",
  className,
  testID,
}: AmountSummaryRootProps) {
  return (
    <AmountSummaryContext.Provider value={{ currencySymbol }}>
      <View
        className={cn(
          "gap-1",
          variant === "card"
            ? "rounded-xl border border-border-light bg-bg-card px-4 py-2"
            : "",
          className,
        )}
        testID={testID}
      >
        {children}
      </View>
    </AmountSummaryContext.Provider>
  );
}

export interface AmountSummaryRowProps {
  label: string;
  value: number | string | null | undefined;
  currencySymbol?: string;
  prefix?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  testID?: string;
}

function Row({
  label,
  value,
  currencySymbol,
  prefix,
  className,
  labelClassName,
  valueClassName,
  testID,
}: AmountSummaryRowProps) {
  const context = useContext(AmountSummaryContext);
  const resolvedCurrencySymbol = currencySymbol ?? context?.currencySymbol;

  if (resolvedCurrencySymbol === undefined) {
    throw new Error("AmountSummary.Row requires a currencySymbol or an AmountSummary.Root.");
  }

  return (
    <View
      className={cn("flex-row items-center justify-between gap-3 py-1", className)}
      testID={testID}
    >
      <Typography.Text className={cn("flex-1 text-text-secondary", labelClassName)}>
        {label}
      </Typography.Text>
      <Monetary
        className={cn("text-text-primary", valueClassName)}
        currencySymbol={resolvedCurrencySymbol}
        prefix={prefix}
        semibold
        textVariant="body"
        value={value}
      />
    </View>
  );
}

export type AmountSummaryTotalProps = AmountSummaryRowProps;

function Total(props: AmountSummaryTotalProps) {
  return (
    <>
      <View className="my-1 border-t border-border-light" />
      <Row
        {...props}
        className={cn("py-2", props.className)}
        labelClassName={cn("text-text-primary font-semibold", props.labelClassName)}
        valueClassName={cn("text-text-primary", props.valueClassName)}
      />
    </>
  );
}

const AmountSummary = { Root, Row, Total };

export default AmountSummary;
