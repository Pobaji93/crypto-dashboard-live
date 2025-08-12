import { coingeckoClient } from "./coingeckoClient";

export async function fetchCoinPrices(
  ids: string[],
  currency: "eur" | "usd" = "eur"
) {
  if (!ids.length) return {};
  try {
    return await coingeckoClient.get(
      "/simple/price",
      { ids: ids.join(","), vs_currencies: currency },
      60 * 1000
    );
  } catch (error) {
    console.error("Fehler beim Laden der Preise:", error);
    return {};
  }
}
