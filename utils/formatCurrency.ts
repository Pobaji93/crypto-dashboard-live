export function formatCurrency(
    value: number,
    currency: "usd" | "eur"
  ): string {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    });
  }
  