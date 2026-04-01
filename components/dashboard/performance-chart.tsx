"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ChartData {
  labels: string[];
  values: number[];
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    values: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch 30 days of BTC price history
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily",
          { headers: { "x-cg-demo-api-key": "CG-4mhu23ZJbY2MH2xuXwDF2FPa" } }
        );
        const data = await res.json();
        
        if (data.prices) {
          // Simulate portfolio performance based on BTC price movements
          const baseValue = 10000;
          const prices = data.prices;
          const startPrice = prices[0][1];
          
          const labels: string[] = [];
          const values: number[] = [];
          
          prices.forEach(([timestamp, price]: [number, number]) => {
            const date = new Date(timestamp);
            labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
            // Portfolio value changes based on BTC price movement (simulated with some variance)
            const priceChange = (price - startPrice) / startPrice;
            const portfolioValue = baseValue * (1 + priceChange * 1.5 + Math.random() * 0.02);
            values.push(Math.round(portfolioValue));
          });
          
          setChartData({ labels, values });
        }
      } catch (err) {
        console.warn("Chart data fetch error:", err);
        // Fallback to static data
        setChartData({
          labels: ["Jan 1", "Jan 8", "Jan 15", "Jan 22", "Jan 29", "Feb 5", "Feb 12"],
          values: [10000, 11200, 10800, 13400, 14200, 13800, 15600],
        });
      }
    }
    fetchData();
  }, []);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        fill: true,
        label: "Portfolio Value",
        data: chartData.values,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: "#8b5cf6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1a1d2e",
        titleColor: "#fff",
        bodyColor: "#a0a8c0",
        borderColor: "#2a2d3e",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#454d6a",
          font: { size: 10 },
          maxTicksLimit: 7,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#454d6a",
          font: { size: 11 },
          callback: (value: string | number) => `$${(Number(value) / 1000).toFixed(0)}k`,
        },
        grid: {
          color: "rgba(255,255,255,0.025)",
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (chartData.labels.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <Line data={data} options={options} />
    </div>
  );
}
