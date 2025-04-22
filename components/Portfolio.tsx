"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FiTrash2 } from "react-icons/fi"; // <-- Icon-Bibliothek!

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  price: number;
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

    setDeletingId(id);
    await new Promise((res) => setTimeout(res, 200)); // Mini-Delay für Animation

    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Löschen fehlgeschlagen:", error.message);
    } else {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
    setDeletingId(null);
  };

  const total = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);

  if (loading) return <p>🔄 Lade dein Portfolio...</p>;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">📊 Dein Portfolio</h2>
      {holdings.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <ul className="divide-y">
          {holdings.map((h) => (
            <li
              key={h.id}
              className={`flex justify-between items-center py-2 transition-opacity duration-300 ${
                deletingId === h.id ? "opacity-30" : ""
              }`}
            >
              <span className="font-medium">{h.symbol}</span>
              <span>
                {h.amount} × {h.price.toLocaleString()} $ ={" "}
                {(h.amount * h.price).toLocaleString()} $
              </span>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-gray-500 hover:text-red-600 transition ml-4"
                title="Eintrag löschen"
              >
                <FiTrash2 size={18} />
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
