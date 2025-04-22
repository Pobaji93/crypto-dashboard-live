"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinList } from "../lib/fetchCoinList";

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
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [coinList, setCoinList] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldingsAndCoins = async () => {
      const { data, error } = await supabase.from("portfolio").select("*");

      if (error) {
        console.error("Fehler beim Laden:", error.message);
      } else {
        setHoldings(data as Holding[]);
      }

      const coins = await fetchCoinList();
      setCoinList(coins);

      setLoading(false);
    };

    fetchHoldingsAndCoins();
  }, []);

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  const getCoinData = (symbol: string): CoinData | undefined =>
    coinList.find((coin) => coin.symbol.toLowerCase() === symbol.toLowerCase());

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">📊 Dein Portfolio</h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="space-y-1">
          {holdings.map((h) => {
            const coin = getCoinData(h.symbol);
            return (
              <li
                key={h.id}
                className="flex justify-between items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  {coin?.image && (
                    <img
                      src={coin.image}
                      alt={h.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="font-medium uppercase">{h.symbol}</span>
                </div>
                <span>
                  {h.amount} × {h.price.toLocaleString()} $ ={" "}
                  {(h.amount * h.price).toLocaleString()} $
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-2 font-bold text-right">
        Total: {total.toLocaleString()} $
      </div>
    </section>
  );
}