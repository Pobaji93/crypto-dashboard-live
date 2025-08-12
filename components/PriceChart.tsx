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
import { coingeckoClient } from "../lib/coingeckoClient";

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
  const [selectedDays, setSelectedDays] = useState<string>("7");
  const [days, setDays] = useState<string>("7");

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef(0);

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

  // debounce quick changes to the selected range
  useEffect(() => {
    const t = setTimeout(() => setDays(selectedDays), 300);
    return () => clearTimeout(t);
  }, [selectedDays]);

  const fetchChartData = useCallback(async () => {
    const reqId = ++requestRef.current;
    const cacheKey = `chart-${coinId}-${days}`;

    if (days === "ytd" || days === "max") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setChartData(parsed.data);
            setError(null);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    try {
      setLoading(true);
      let data;

      if (days === "ytd") {
        const currentYear = new Date().getFullYear();
        const from = Math.floor(new Date(`${currentYear}-01-01`).getTime() / 1000);
        const to = Math.floor(Date.now() / 1000);
        data = await coingeckoClient.get(
          `/coins/${coinId}/market_chart/range`,
          { vs_currency: "eur", from, to },
          24 * 60 * 60 * 1000
        );
      } else {
        data = await coingeckoClient.get(
          `/coins/${coinId}/market_chart`,
          { vs_currency: "eur", days },
          days === "max" ? 24 * 60 * 60 * 1000 : undefined
        );
      }

      if (reqId !== requestRef.current) return;

      const prices = data.prices.map((p: any) => p[1]);
      const labels = data.prices.map((p: any) =>
        new Date(p[0]).toLocaleDateString()
      );

      const chart = {
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
      };

      setChartData(chart);
      setError(null);

      if (days === "ytd" || days === "max") {
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: chart, timestamp: Date.now() })
          );
        } catch {}
      }
    } catch (err: any) {
      if (reqId === requestRef.current) {
        setError(err.message || "Unbekannter Fehler");
      }
    } finally {
      if (reqId === requestRef.current) {
        setLoading(false);
      }
    }
  }, [coinId, days]);

  useEffect(() => {
    if (isVisible) {
      fetchChartData();
    }
  }, [fetchChartData, isVisible]);

  if (!isVisible)
    return <div ref={ref} style={{ minHeight: "200px" }} />;

  return (
    <div ref={ref} className="card">
      <div className="flex flex-wrap gap-2 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedDays(range.value)}
            className={`px-3 py-1 text-sm rounded ${
              selectedDays === range.value
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

      {error ? (
        <p className="text-red-500 text-sm transition-opacity duration-500">
          ⚠️ {error}
        </p>
      ) : !chartData || !chartData.labels?.length ? (
        loading ? (
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse transition-opacity duration-500" />
        ) : (
          <p className="text-sm text-gray-400 transition-opacity duration-500">
            Keine Daten verfügbar.
          </p>
        )
      ) : (
        <div className="relative h-64">
          <div
            className={`transition-opacity duration-500 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            <Line data={chartData} />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              loading ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
