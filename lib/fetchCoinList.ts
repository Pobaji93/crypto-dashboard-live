let coinListCache: {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}[] | null = null;

export async function fetchCoinList(currency: "eur" | "usd" = "eur") {
  if (coinListCache && currency === "eur") return coinListCache; // cache nur für EUR

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
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));

    if (currency === "eur") {
      coinListCache = formatted;
    }

    return formatted;
  } catch (error) {
    console.error("Fehler beim Laden der Coin-Liste:", error);
    return [];
  }
}
