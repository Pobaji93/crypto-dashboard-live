// lib/fetchCoinList.ts

let coinListCache: {
  id: string;
  symbol: string;
  name: string;
  image: string;
}[] | null = null;

export async function fetchCoinList(): Promise<{
  id: string;
  symbol: string;
  name: string;
  image: string;
}[]> {
  if (coinListCache) return coinListCache;

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1");
    const data = await res.json();

    coinListCache = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));

    return coinListCache;
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}