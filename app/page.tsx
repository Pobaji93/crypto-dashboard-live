"use client";

import Portfolio from "../components/Portfolio";
import PriceChart from "../components/PriceChart";
import AddHoldingForm from "../components/AddHoldingForm";

export default function Home() {
  return (
    <main className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🪙 Crypto Dashboard</h1>
      <AddHoldingForm />
      <Portfolio />
      <PriceChart coinId="bitcoin" />
      <PriceChart coinId="ethereum" />
    </main>
  );
}
