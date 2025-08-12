type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

type CacheEntry = {
  data: Coin[];
  timestamp: number;
};

const CACHE_TTL = 10 * 60 * 1000; // 10 Minuten

const coinListCache: Record<"eur" | "usd", CacheEntry | undefined> = {};

export async function fetchCoinList(currency: "eur" | "usd" = "eur") {
  const cached = coinListCache[currency];
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&per_page=100&page=1`
    );
    const data = await res.json();

    const formatted = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
    }));

    coinListCache[currency] = { data: formatted, timestamp: now };

    return formatted;
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}
