"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { searchCoins } from "../lib/searchCoins";

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
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      const list = await searchCoins(search);
      setResults(list);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!symbol || !amount || !price) {
      setMessage("Bitte alle Felder ausfüllen.");
      return;
    }

    if (!selectedCoin || selectedCoin.symbol !== symbol.toLowerCase()) {
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
      setSearch("");
      setSelectedCoin(null);
      setAmount("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-xl font-semibold">➕ Coin hinzufügen</h2>

      <div className="relative">
        <label className="block mb-1 font-medium">Coin</label>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSymbol("");
            setSelectedCoin(null);
          }}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white"
          placeholder="Name oder Symbol eingeben"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border mt-1 max-h-48 overflow-y-auto">
            {results.map((coin) => (
              <li key={coin.id}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    setSymbol(coin.symbol);
                    setSearch(`${coin.name} (${coin.symbol.toUpperCase()})`);
                    setSelectedCoin(coin);
                    setResults([]);
                  }}
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Menge</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Preis ({currency.toUpperCase()})</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
      >
        Speichern
      </button>

      {message && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{message}</p>
      )}
    </form>
  );
}
