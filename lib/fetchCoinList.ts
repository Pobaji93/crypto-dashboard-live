import { coingeckoClient } from "./coingeckoClient";

export async function fetchCoinList(currency: "eur" | "usd" = "eur") {
  try {
    const data = await coingeckoClient.get(
      "/coins/markets",
      { vs_currency: currency, per_page: 100, page: 1 },
      5 * 60 * 1000
    );

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}
