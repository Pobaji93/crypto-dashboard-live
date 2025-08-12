"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinList } from "../lib/fetchCoinList";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
};

type Props = {
  currency: "eur" | "usd";
};

export default function AddHoldingForm({ currency }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCoins = async () => {
      const list = await fetchCoinList(currency);
      if (list) {
        setCoins(list);
      }
    };
    loadCoins();
  }, [currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!symbol || !amount || !price) {
      setMessage("Bitte alle Felder ausfüllen.");
      return;
    }

    const selected = coins.find((c) => c.symbol === symbol.toLowerCase());
    if (!selected) {
      setMessage("Ungültiger Coin.");
      return;
    }

    const { error } = await supabase.from("portfolio").insert({
      symbol: symbol.toUpperCase(),
      amount: parseFloat(amount),
      price: parseFloat(price),
    });

    if (error) {
      setMessage("Fehler beim Speichern.");
      console.error(error);
    } else {
      setMessage("✅ Erfolgreich hinzugefügt.");
      setSymbol("");
      setAmount("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-xl font-semibold">➕ Coin hinzufügen</h2>

      <div>
        <label className="block mb-1 font-medium">Coin</label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full"
        >
          <option value="">Bitte wählen</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.symbol}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Menge</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Preis ({currency.toUpperCase()})</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-tr-green text-tr-dark px-4 py-2 rounded hover:bg-tr-green-dark mt-2"
      >
        Speichern
      </button>

      {message && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{message}</p>
      )}
    </form>
  );
}
