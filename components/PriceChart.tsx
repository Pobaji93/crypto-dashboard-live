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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );

        if (!res.ok) {
          throw new Error("Fehler beim Laden der Chartdaten.");
        }

        const data = await res.json();

        if (!data.prices || data.prices.length === 0) {
          throw new Error("Keine Preisdaten gefunden.");
        }

        const prices = data.prices.map((p: any) => p[1]);
        const labels = data.prices.map((p: any) =>
          new Date(p[0]).toLocaleDateString()
        );

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId.toUpperCase()} Preis (USD)`,
              data: prices,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
            },
          ],
        });

        setError(null);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId]);

  if (loading) return <p className="text-sm text-gray-400">🔄 Lade Chart...</p>;
  if (error) return <p className="text-red-500 text-sm">⚠️ {error}</p>;
  if (!chartData || !chartData.labels?.length)
    return <p className="text-sm text-gray-400">Keine Daten verfügbar.</p>;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">
        📈 {coinId.toUpperCase()} – Letzte 7 Tage
      </h2>
      <Line data={chartData} />
    </div>
  );
}