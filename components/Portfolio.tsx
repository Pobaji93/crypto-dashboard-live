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

      if (error) {
        console.error("Fehler beim Laden:", error.message);
      } else {
        setHoldings(data as Holding[]);
      }

      setLoading(false);
    };

    fetchHoldings();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("portfolio")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Löschen fehlgeschlagen:", error.message);
    } else {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">📊 Dein Portfolio</h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {holdings.map((h) => (
            <li
              key={h.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="font-medium">{h.symbol}</span>
              <span className="text-sm text-gray-700">
                {h.amount} × {h.price.toLocaleString()} $ ={" "}
                {(h.amount * h.price).toLocaleString()} $
              </span>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-red-600 hover:text-red-800 text-sm ml-4"
              >
                ✖️
              </button>
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
