export async function fetchCoinPrices(ids: string[], currency: "eur" | "usd" = "eur") {
  if (!ids.length) return {};
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=${currency}`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Fehler beim Laden der Preise:", error);
    return {};
  }
}
