// lib/fetchCoinList.ts

let cachedCoins: any[] | null = null;

export async function fetchCoinList(): Promise<any[]> {
  if (cachedCoins) return cachedCoins;

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const data = await res.json();
    cachedCoins = data;
    return data;
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}