// lib/fetchCoinList.ts

let cachedList: {
  id: string;
  symbol: string;
  name: string;
  image: string;
}[] = [];

export async function fetchCoinList() {
  if (cachedList.length > 0) return cachedList;

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false");
    const data = await res.json();

    cachedList = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
    }));

    return cachedList;
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}