"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinList } from "../lib/fetchCoinList";
import { FaTrash } from "react-icons/fa";

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
      if (coins) setCoinList(coins);
      setLoading(false);
    };

    fetchHoldingsAndCoins();
  }, []);

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  const getCoinData = (symbol: string): CoinData | undefined =>
    coinList.find((coin) => coin.symbol.toLowerCase() === symbol.toLowerCase());

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Fehler beim Löschen:", error.message);
    } else {
      setHoldings(holdings.filter((h) => h.id !== id));
    }
  };

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>📊</span> Dein Portfolio
      </h2>

      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="space-y-3">
          {holdings.map((h) => {
            const coin = getCoinData(h.symbol);
            return (
              <li
                key={h.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded shadow"
              >
                <span className="flex items-center gap-2">
                  {coin?.image && (
                    <img
                      src={coin.image}
                      alt={h.symbol}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="font-medium uppercase">{h.symbol}</span>
                </span>

                <span>
                  {h.amount} × {h.price.toLocaleString()} $ ={" "}
                  {(h.amount * h.price).toLocaleString()} $
                </span>

                <button
                  onClick={() => handleDelete(h.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${h.symbol}`}
                >
                  <FaTrash />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 text-right font-semibold">
        Total: {total.toLocaleString()} $
      </div>
    </div>
  );
}