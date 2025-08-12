"use client";

import { useState, useEffect } from "react";
import Portfolio from "../components/Portfolio";
import AddHoldingForm from "../components/AddHoldingForm";
import PortfolioSummary from "../components/PortfolioSummary";
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
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          onClick={() => switchCurrency("eur")}
        >
          EUR
        </button>
        <button
          className={`px-3 py-1 rounded ${
            currency === "usd"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          onClick={() => switchCurrency("usd")}
        >
          USD
        </button>
      </div>

      <PortfolioSummary currency={currency} exchangeRate={exchangeRate} />
      <AddHoldingForm currency={currency} />
      <Portfolio currency={currency} exchangeRate={exchangeRate} />
    </main>
  );
}
