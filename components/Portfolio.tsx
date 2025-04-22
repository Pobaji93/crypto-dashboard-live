"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { coinLogos } from "../lib/coinLogos";
import { FaTrash } from "react-icons/fa";

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
      const { data, error } = await supabase.from("portfolio").select("*");
      if (error) {
        console.error("SUPABASE ERROR:", error.message);
      } else {
        setHoldings(data as Holding[]);
      }
      setLoading(false);
    };
    fetchHoldings();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Möchtest du diesen Eintrag wirklich löschen?");
    if (!confirm) return;

    setHoldings((prev) => prev.filter((h) => h.id !== id));

    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      alert("Fehler beim Löschen");
      console.error("SUPABASE DELETE ERROR:", error.message);
    }
  };

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📊 Dein Portfolio
      </h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="divide-y">
          {holdings.map((h) => (
            <li
              key={h.id}
              className="flex justify-between items-center py-2 transition-opacity duration-300"
            >
              <div className="flex items-center gap-2">
                <img
                  src={coinLogos[h.symbol.toUpperCase()] || "/default-coin.png"}
                  alt={h.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{h.symbol}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>
                  {h.amount} × {h.price.toLocaleString()} $ ={" "}
                  {(h.amount * h.price).toLocaleString()} $
                </span>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Eintrag löschen"
                >
                  <FaTrash />
                </button>
              </div>
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
