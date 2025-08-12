"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

const timeRanges = [
  { label: "1T", value: "1" },
  { label: "1W", value: "7" },
  { label: "1M", value: "30" },
  { label: "1J", value: "365" },
  { label: "YTD", value: "ytd" },
  { label: "MAX", value: "max" },
];

export default function PriceChart({ coinId }: Props) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<string>("7");

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);

      let url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=${days}`;

      if (days === "ytd") {
        const currentYear = new Date().getFullYear();
        const from = Math.floor(new Date(`${currentYear}-01-01`).getTime() / 1000);
        const to = Math.floor(Date.now() / 1000);
        url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`;
      }

      const res = await fetch(url);

      if (!res.ok) throw new Error("Fehler beim Laden der Chartdaten.");

      const data = await res.json();

      const prices = data.prices.map((p: any) => p[1]);
      const labels = data.prices.map((p: any) =>
        new Date(p[0]).toLocaleDateString()
      );

      setChartData({
        labels,
        datasets: [
          {
            label: `${coinId.toUpperCase()} Preis (EUR)`,
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
  }, [coinId, days]);

  useEffect(() => {
    if (isVisible) {
      fetchChartData();
    }
  }, [fetchChartData, isVisible]);

  if (!isVisible) return <div ref={ref} style={{ minHeight: "200px" }} />;

  if (loading) return <p className="text-sm text-gray-400">🔄 Lade Chart...</p>;
  if (error) return <p className="text-red-500 text-sm">⚠️ {error}</p>;
  if (!chartData || !chartData.labels?.length)
    return <p className="text-sm text-gray-400">Keine Daten verfügbar.</p>;

  return (
    <div ref={ref} className="card">
      <div className="flex flex-wrap gap-2 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setDays(range.value)}
            className={`px-3 py-1 text-sm rounded ${
              days === range.value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">
        📈 {coinId.toUpperCase()} Chart
      </h2>
      <Line data={chartData} />
    </div>
  );
}
