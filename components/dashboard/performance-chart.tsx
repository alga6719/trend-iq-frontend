"use client";

import { useEffect, useRef } from "react";
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

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Portfolio Value",
      data: [10000, 11200, 10800, 13400, 14200, 13800, 15600],
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      tension: 0.4,
      pointRadius: 3,
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
  },
  scales: {
    x: {
      ticks: {
        color: "#454d6a",
        font: { size: 11 },
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
        callback: (value: string | number) => `$${Number(value).toLocaleString()}`,
      },
      grid: {
        color: "rgba(255,255,255,0.025)",
      },
      border: {
        display: false,
      },
    },
  },
};

export function PerformanceChart() {
  return (
    <div className="h-[220px]">
      <Line data={data} options={options} />
    </div>
  );
}
