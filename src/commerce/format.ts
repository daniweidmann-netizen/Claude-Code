import type { Money } from "./types";

export function formatMoney(money: Money, locale = "de-CH") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 2,
  }).format(Number(money.amount));
}
