"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinPrices } from "../lib/fetchCoinPrices";
import { FaTrash } from "react-icons/fa";
import PriceChart from "../components/PriceChart";
import { formatCurrency } from "../utils/formatCurrency";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
};

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
};

type Props = {
  currency: "eur" | "usd";
  exchangeRate: number;
};

export default function Portfolio({ currency, exchangeRate }: Props) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [coinList, setCoinList] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldingsAndCoins = async () => {
      const { data, error } = await supabase.from("portfolio").select("*");
      if (error) {
        console.error("Fehler beim Laden:", error.message);
      } else {
        const holdingsData = (data as Holding[]) || [];
        setHoldings(holdingsData);

        const symbols = Array.from(
          new Set(holdingsData.map((h) => h.symbol.toLowerCase()))
        );

        if (symbols.length > 0) {
          try {
            const listRes = await fetch(
              "https://api.coingecko.com/api/v3/coins/list"
            );
            const list = await listRes.json();
            const relevant = symbols
              .map((sym) =>
                list.find((c: any) => c.symbol.toLowerCase() === sym)
              )
              .filter(Boolean);
            const ids = relevant.map((c: any) => c.id);

            const priceData = await fetchCoinPrices(ids, "eur");

            const coins: CoinData[] = await Promise.all(
              relevant.map(async (c: any) => {
                let image = "";
                try {
                  const imgRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${c.id}`
                  );
                  const imgData = await imgRes.json();
                  image = imgData.image?.thumb || "";
                } catch {}

                return {
                  id: c.id,
                  symbol: c.symbol,
                  name: c.name,
                  image,
                  current_price: priceData[c.id]?.eur || 0,
                } as CoinData;
              })
            );

            setCoinList(coins);
          } catch (err) {
            console.error("Fehler beim Laden der Preise:", err);
          }
        }
      }

      setLoading(false);
    };

    fetchHoldingsAndCoins();
  }, []);

  const getCoinData = (symbol: string): CoinData | undefined =>
    coinList.find((coin) => coin.symbol.toLowerCase() === symbol.toLowerCase());

  const adjustedPrice = (price: number) =>
    currency === "eur" ? price : price * exchangeRate;

  const adjustedCurrentPrice = (price: number) =>
    currency === "eur" ? price : price * exchangeRate;

  const groupedHoldings = holdings.reduce<Record<string, { amount: number; totalCost: number }>>(
    (acc, h) => {
      const key = h.symbol.toLowerCase();
      if (!acc[key]) {
        acc[key] = { amount: 0, totalCost: 0 };
      }
      acc[key].amount += h.amount;
      acc[key].totalCost += h.amount * adjustedPrice(h.price);
      return acc;
    },
    {}
  );

  const totalInvested = Object.values(groupedHoldings).reduce(
    (sum, g) => sum + g.totalCost,
    0
  );

  const totalCurrentValue = Object.keys(groupedHoldings).reduce((sum, symbol) => {
    const coin = getCoinData(symbol);
    if (!coin) return sum;
    return sum + adjustedCurrentPrice(coin.current_price) * groupedHoldings[symbol].amount;
  }, 0);

  const profitLoss = totalCurrentValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Fehler beim Löschen:", error.message);
    } else {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
  };

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  const coinSymbols = Object.keys(groupedHoldings).filter(
    (symbol) => groupedHoldings[symbol].amount > 0
  );

  if (coinSymbols.length === 0) return <p>Keine Einträge gefunden.</p>;

  return (
    <div className="space-y-12">
      <div className="card p-4 space-y-4">
        <ul className="space-y-4">
          {holdings.map((h) => {
            const coin = getCoinData(h.symbol);
            const currentPrice = coin?.current_price || 0;
            const totalValue = adjustedCurrentPrice(currentPrice) * h.amount;
            const invested = adjustedPrice(h.price) * h.amount;
            const diff = totalValue - invested;
            const diffPercent = invested > 0 ? (diff / invested) * 100 : 0;

            return (
              <li
                key={h.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 p-3 rounded shadow"
              >
                <div className="flex items-center gap-2">
                  {coin?.image && (
                    <img
                      src={coin.image}
                      alt={h.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-medium uppercase">{h.symbol}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sm:mt-0">
                  <span>Menge: {h.amount}</span>
                  <span>∅ Preis: {formatCurrency(adjustedPrice(h.price), currency)}</span>
                  <span>Wert: {formatCurrency(totalValue, currency)}</span>
                  <span className={diff >= 0 ? "text-green-500" : "text-red-500"}>
                    {diff >= 0 ? "▲" : "▼"} {formatCurrency(diff, currency)} ({diffPercent.toFixed(2)}%)
                  </span>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove ${h.symbol}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card p-4 text-center space-y-2">
        <div>Gesamtes investiertes Kapital: {formatCurrency(totalInvested, currency)}</div>
        <div>Aktueller Wert: {formatCurrency(totalCurrentValue, currency)}</div>
        <div className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
          Gewinn/Verlust: {formatCurrency(profitLoss, currency)} ({profitLossPercent.toFixed(2)}%)
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {coinSymbols.map((symbol) => {
          const coin = getCoinData(symbol);
          if (!coin) return null;
          return (
            <div key={symbol} className="card p-4 space-y-4">
              <div className="flex items-center gap-2">
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={symbol}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="font-medium uppercase">{symbol}</span>
              </div>

              <div className="mt-4">
                <PriceChart coinId={coin.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
