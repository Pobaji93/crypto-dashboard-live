"use client";

import { useState, useEffect } from "react";
import Portfolio from "../components/Portfolio";
import AddHoldingForm from "../components/AddHoldingForm";
import { fetchExchangeRate } from "../lib/fetchExchangeRate";

export default function Home() {
  const [currency, setCurrency] = useState<"eur" | "usd">("eur");
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored === "eur" || stored === "usd") {
      setCurrency(stored);
    }
  }, []);

  useEffect(() => {
    const loadRate = async () => {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
    };
    loadRate();
  }, []);

  const switchCurrency = async (cur: "eur" | "usd") => {
    setCurrency(cur);
    localStorage.setItem("currency", cur);
    const rate = await fetchExchangeRate();
    setExchangeRate(rate);
  };

  return (
    <main className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🪙 Crypto Dashboard</h1>

      <div className="flex justify-end gap-2">
        <button
          className={`px-3 py-1 rounded ${
            currency === "eur"
              ? "bg-tr-green text-tr-dark"
              : "bg-gray-200 dark:bg-tr-gray text-gray-800 dark:text-tr-light"
          }`}
          onClick={() => switchCurrency("eur")}
        >
          EUR
        </button>
        <button
          className={`px-3 py-1 rounded ${
            currency === "usd"
              ? "bg-tr-green text-tr-dark"
              : "bg-gray-200 dark:bg-tr-gray text-gray-800 dark:text-tr-light"
          }`}
          onClick={() => switchCurrency("usd")}
        >
          USD
        </button>
      </div>

      <AddHoldingForm currency={currency} />
      <Portfolio currency={currency} exchangeRate={exchangeRate} />
    </main>
  );
}
