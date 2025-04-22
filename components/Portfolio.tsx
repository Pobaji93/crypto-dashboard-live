"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { HiTrash } from "react-icons/hi";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
  isDeleting?: boolean;
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data, error } = await supabase.from("portfolio").select("*");
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
    const confirm = window.confirm("Möchtest du diesen Eintrag wirklich löschen?");
    if (!confirm) return;

    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isDeleting: true } : h))
    );

    await new Promise((r) => setTimeout(r, 300)); // kleine Wartezeit für die Animation

    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Fehler beim Löschen:", error.message);
    } else {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
  };

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
            <li
              key={h.id}
              className={`flex justify-between items-center transition-opacity duration-300 ${
                h.isDeleting ? "opacity-0" : "opacity-100"
              }`}
            >
              <div>
                <span className="font-medium">{h.symbol.toUpperCase()}</span>{" "}
                – {h.amount} × {h.price.toLocaleString()} $ ={" "}
                {(h.amount * h.price).toLocaleString()} $
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-red-600 hover:text-red-800 transition-colors ml-4"
                title="Eintrag löschen"
              >
                <HiTrash size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold text-right text-lg">
        Gesamt: {total.toLocaleString()} $
      </div>
    </section>
  );
}
