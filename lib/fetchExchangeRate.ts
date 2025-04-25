let exchangeRateCache: { rate: number; timestamp: number } | null = null;

export async function fetchExchangeRate() {
  const now = Date.now();

  if (exchangeRateCache && now - exchangeRateCache.timestamp < 10 * 60 * 1000) {
    // Cache ist 10 Minuten gültig
    return exchangeRateCache.rate;
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=eur"
    );
    const data = await res.json();
    const rate = 1 / data.usd.eur; // USD -> EUR Umrechnen

    exchangeRateCache = {
      rate,
      timestamp: now,
    };

    return rate;
  } catch (error) {
    console.error("Fehler beim Laden des Wechselkurses:", error);
    return 1; // Fallback: 1:1
  }
}
