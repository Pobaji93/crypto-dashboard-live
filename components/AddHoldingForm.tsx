"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCoinList } from "../lib/fetchCoinList";

type CoinOption = {
  id: string;
  symbol: string;
  name: string;
  image: string;
};

export default function AddHoldingForm() {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCoins = async () => {
      const coinList = await fetchCoinList();
      setCoins(coinList);
    };
    loadCoins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol || !amount || !price) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }

    const { error } = await supabase.from("portfolio").insert([{ symbol, amount, price }]);

    if (error) {
      setError("Fehler beim Speichern: " + error.message);
      return;
    }

    setSuccess(true);
    setError("");
    setSymbol("");
    setAmount(0);
    setPrice(0);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">➕ Coin hinzufügen</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Erfolgreich gespeichert!</p>}

      <div>
        <label className="block mb-1 font-medium">Coin</label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Bitte wählen...</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.symbol}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Anzahl</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          step="any"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Preis pro Coin in $</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          step="any"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Speichern
      </button>
    </form>
  );
}