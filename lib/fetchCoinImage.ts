import { coingeckoClient } from "./coingeckoClient";

export async function fetchCoinImage(symbol: string): Promise<string | null> {
  try {
    const list = await coingeckoClient.get("/coins/list", {}, 24 * 60 * 60 * 1000);

    const match = list.find(
      (coin: any) => coin.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (!match) return null;

    const coin = await coingeckoClient.get(`/coins/${match.id}`, {}, 24 * 60 * 60 * 1000);

    return coin.image?.thumb || null;
  } catch (error) {
    console.error("Fehler beim Laden des Logos:", error);
    return null;
  }
}
