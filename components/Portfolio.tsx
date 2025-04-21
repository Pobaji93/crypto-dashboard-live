"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*");

      console.log("📦 SUPABASE DATA:", data);
      console.log("⚠️ SUPABASE ERROR:", error);

      if (error) {
        console.error("Fehler beim Laden:", error.message);
      } else {
        setHoldings(data as Holding[]);
      }

      setLoading(false);
    };

    fetchHoldings();
  }, []);

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">📊 Dein Portfolio</h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="space-y-1">
          {holdings.map((h) => (
            <li key={h.id} className="flex justify-between">
              <span>{h.symbol}</span>
              <span>
                {h.amount} × {h.price.toLocaleString()} $ ={" "}
                {(h.amount * h.price).toLocaleString()} $
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 font-bold text-right">
        Total: {total.toLocaleString()} $
      </div>
    </section>
  );
}
