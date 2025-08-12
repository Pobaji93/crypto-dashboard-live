import { coingeckoClient } from "./coingeckoClient";

export async function fetchExchangeRate() {
  try {
    const data = await coingeckoClient.get(
      "/simple/price",
      { ids: "usd", vs_currencies: "eur" },
      10 * 60 * 1000
    );
    return 1 / data.usd.eur; // USD -> EUR Umrechnen
  } catch (error) {
    console.error("Fehler beim Laden des Wechselkurses:", error);
    return 1; // Fallback: 1:1
  }
}
