"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinList } from "../lib/fetchCoinList";
import { formatCurrency } from "../utils/formatCurrency";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
};

type CoinData = {
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
};

type Props = {
  currency: "eur" | "usd";
  exchangeRate: number;
};

export default function PortfolioSummary({ currency, exchangeRate }: Props) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from("portfolio").select("*");
      setHoldings((data as Holding[]) || []);

      const list = await fetchCoinList("eur"); // CoinGecko nur in EUR
      setCoins(list as CoinData[]);

      setLoading(false);
    };

    loadData();
  }, []);

  const adjusted = (value: number) =>
    currency === "eur" ? value : value * exchangeRate;

  const getCoin = (symbol: string) =>
    coins.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase());

  const totalValue = holdings.reduce((sum, h) => {
    const coin = getCoin(h.symbol);
    if (!coin) return sum;
    return sum + adjusted(coin.current_price) * h.amount;
  }, 0);

  const totalInvested = holdings.reduce(
    (sum, h) => sum + adjusted(h.price) * h.amount,
    0
  );

  const profitLoss = totalValue - totalInvested;

  const dailyChange = holdings.reduce((sum, h) => {
    const coin = getCoin(h.symbol);
    if (!coin) return sum;
    return (
      sum +
      adjusted(coin.current_price) * h.amount *
        (coin.price_change_percentage_24h / 100)
    );
  }, 0);

  const dailyClass = dailyChange >= 0 ? "text-green-500" : "text-red-500";
  const plClass = profitLoss >= 0 ? "text-green-500" : "text-red-500";

  if (loading) {
    return <div className="card p-4 text-center">🔄 Lade Zusammenfassung...</div>;
  }

  return (
    <div className="card p-4 text-center space-y-2">
      <div className="text-2xl font-bold">
        Gesamtwert: {formatCurrency(totalValue, currency)}
      </div>
      <div className={`text-xl ${dailyClass}`}>
        Tagesperformance: {dailyChange >= 0 ? "▲" : "▼"} {formatCurrency(dailyChange, currency)}
      </div>
      <div className={`text-xl ${plClass}`}>
        Gewinn/Verlust: {profitLoss >= 0 ? "▲" : "▼"} {formatCurrency(profitLoss, currency)}
      </div>
    </div>
  );
}

