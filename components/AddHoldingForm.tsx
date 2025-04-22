"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddHoldingForm() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("portfolio").insert([
      {
        symbol,
        amount: parseFloat(amount),
        price: parseFloat(price),
      },
    ]);
    if (error) {
      alert("Fehler beim Einfügen: " + error.message);
    } else {
      setSuccess(true);
      setSymbol("");
      setAmount("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">➕ Coin hinzufügen</h2>

      <input
        type="text"
        placeholder="Symbol (z. B. BTC)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Menge (z. B. 0.5)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Preis in $"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Hinzufügen
      </button>

      {success && <p className="text-green-600">✅ Hinzugefügt!</p>}
    </form>
  );
}
