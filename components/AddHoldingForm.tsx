"use client";

import { useState, useEffect } from "react";
import { fetchCoins } from "../lib/fetchCoins";

type CoinOption = {
  id: string;
  symbol: string;
  name: string;
  image: string;
};

export default function AddHoldingForm() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [coins, setCoins] = useState<CoinOption[]>([]);

  useEffect(() => {
    fetchCoins().then(setCoins).catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!symbol || !amount || !price) return alert("Bitte alle Felder ausfüllen");

    const res = await fetch("/api/holdings", {
      method: "POST",
      body: JSON.stringify({ symbol, amount: Number(amount), price: Number(price) }),
    });

    if (res.ok) {
      setAmount("");
      setPrice("");
      setSymbol("");
    } else {
      alert("Fehler beim Speichern");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span>➕</span> Coin hinzufügen
      </h2>
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="p-2 border rounded w-full sm:w-48"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="">Coin wählen…</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.symbol}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          step="any"
          placeholder="Menge"
          className="p-2 border rounded w-full sm:w-32"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <input
          type="number"
          step="any"
          placeholder="Preis in $"
          className="p-2 border rounded w-full sm:w-32"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
}