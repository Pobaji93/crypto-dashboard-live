"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddHoldingForm() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔍 Validierung
    if (!symbol || !amount || !price || Number(amount) <= 0 || Number(price) <= 0) {
      setMessage("⚠️ Bitte gib gültige Werte ein.");
      return;
    }

    const { error } = await supabase.from("portfolio").insert([
      {
        symbol: symbol.toUpperCase(),
        amount: parseFloat(amount),
        price: parseFloat(price),
      },
    ]);

    if (error) {
      console.error("Fehler beim Einfügen:", error.message);
      setMessage("❌ Fehler beim Speichern.");
    } else {
      setMessage("✅ Erfolgreich hinzugefügt!");
      setSymbol("");
      setAmount("");
      setPrice("");
    }
  };

  return (
    <section className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">➕ Coin hinzufügen</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Symbol (z. B. BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-2 py-1 rounded w-32"
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Menge"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded w-24"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preis ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border px-2 py-1 rounded w-24"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Hinzufügen
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </section>
  );
}
