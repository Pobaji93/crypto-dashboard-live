"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinImage } from "../lib/fetchCoinImage";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
};

type CoinWithImage = Holding & { imageUrl?: string };

export default function Portfolio() {
  const [holdings, setHoldings] = useState<CoinWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data, error } = await supabase.from("portfolio").select("*");

      if (error) {
        console.error("Fehler beim Laden:", error.message);
        setLoading(false);
        return;
      }

      const enrichedHoldings = await Promise.all(
        (data as Holding[]).map(async (h) => {
          const imageUrl = await fetchCoinImage(h.symbol);
          return { ...h, imageUrl };
        })
      );

      setHoldings(enrichedHoldings);
      setLoading(false);
    };

    fetchHoldings();
  }, []);

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">📊 Dein Portfolio</h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {holdings.map((h) => (
            <li key={h.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {h.imageUrl && (
                  <img
                    src={h.imageUrl}
                    alt={`${h.symbol} logo`}
                    className="w-6 h-6"
                  />
                )}
                <span className="font-medium uppercase">{h.symbol}</span>
              </div>
              <span>
                {h.amount} × {h.price.toLocaleString()} $ ={" "}
                {(h.amount * h.price).toLocaleString()} $
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold text-right">
        Total: {total.toLocaleString()} $
      </div>
    </section>
  );
}
