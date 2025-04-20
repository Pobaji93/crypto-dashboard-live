"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = {
  coinId: string;
};

export default function PriceChart({ coinId }: Props) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
    )
      .then((res) => res.json())
      .then((data) => {
        const prices = data.prices.map((p: any) => p[1]);
        const labels = data.prices.map((p: any) =>
          new Date(p[0]).toLocaleDateString()
        );

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId} price (USD)`,
              data: prices,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.2,
            },
          ],
        });
      });
  }, [coinId]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">
        📈 {coinId.charAt(0).toUpperCase() + coinId.slice(1)} – Last 7 Days
      </h2>
      <Line data={chartData} />
    </div>
  );
}