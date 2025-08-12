import { coingeckoClient } from "./coingeckoClient";

let searchCache: Record<string, {
  id: string;
  name: string;
  symbol: string;
  image: string;
}[]> = {};

export async function searchCoins(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  if (searchCache[q]) return searchCache[q];
  try {
    const data = await coingeckoClient.get(
      "/search",
      { query: q },
      5 * 60 * 1000
    );
    const coins = (data.coins || []).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.thumb,
    }));
    searchCache[q] = coins;
    return coins;
  } catch (error) {
    console.error("Fehler beim Suchen der Coins:", error);
    return [];
  }
}

export function clearSearchCache() {
  searchCache = {};
}
