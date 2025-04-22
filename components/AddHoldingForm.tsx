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
    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        ➕ <span>Coin hinzufügen</span>
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Symbol (z. B. BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Menge"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preis ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition"
        >
          Hinzufügen
        </button>
      </form>
      {message && (
        <p className="mt-3 text-sm text-gray-700">
          {message}
        </p>
      )}
    </section>
  );
}
