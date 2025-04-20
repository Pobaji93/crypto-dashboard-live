"use client";

type Holding = {
  name: string;
  symbol: string;
  amount: number;
  price: number;
};

const dummyHoldings: Holding[] = [
  { name: "Bitcoin", symbol: "BTC", amount: 0.5, price: 30000 },
  { name: "Ethereum", symbol: "ETH", amount: 2, price: 2000 },
];

export default function Portfolio() {
  const total = dummyHoldings.reduce(
    (sum, h) => sum + h.amount * h.price,
    0
  );

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">📊 Portfolio</h2>
      <ul className="space-y-1">
        {dummyHoldings.map((h) => (
          <li key={h.symbol} className="flex justify-between">
            <span>{h.name} ({h.symbol})</span>
            <span>{h.amount} × ${h.price.toLocaleString()} = ${(h.amount * h.price).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 font-bold text-right">
        Total: ${total.toLocaleString()}
      </div>
    </section>
  );
}