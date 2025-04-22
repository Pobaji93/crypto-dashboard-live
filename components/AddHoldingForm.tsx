"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddHoldingForm() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // einfache Validierung
    if (!symbol || !amount || !price) {
      setErrorMessage("Bitte alle Felder ausfüllen.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("portfolio").insert([
      {
        symbol: symbol.toUpperCase(),
        amount: parseFloat(amount),
        price: parseFloat(price),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Fehler beim Speichern:", error.message);
      setErrorMessage("Fehler beim Speichern.");
    } else {
      setSymbol("");
      setAmount("");
      setPrice("");
      setSuccessMessage("✅ Eintrag gespeichert!");
    }
  };

  return (
    <section className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-semibold">➕ Coin hinzufügen</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
        <input
          className="border px-2 py-1 rounded flex-grow min-w-[100px]"
          type="text"
          placeholder="Symbol (z. B. BTC)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded flex-grow min-w-[100px]"
          type="number"
          step="any"
          placeholder="Menge"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded flex-grow min-w-[100px]"
          type="number"
          step="any"
          placeholder="Preis in $"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          type="submit"
          className={`px-4 py-1 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Speichern..." : "Hinzufügen"}
        </button>
      </form>

      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
    </section>
  );
}
