export async function fetchCoinImage(symbol: string): Promise<string | null> {
  try {
    const listRes = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const list = await listRes.json();

    const match = list.find((coin: any) => coin.symbol.toLowerCase() === symbol.toLowerCase());
    if (!match) return null;

    const coinRes = await fetch(`https://api.coingecko.com/api/v3/coins/${match.id}`);
    const coin = await coinRes.json();

    return coin.image?.thumb || null;
  } catch (error) {
    console.error("Fehler beim Laden des Logos:", error);
    return null;
  }
}
