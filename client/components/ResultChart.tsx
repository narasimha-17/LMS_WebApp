"use client";

import { Pie } from "react-chartjs-2";

interface ResultChartProps {
  correct: number;
  wrong: number;
}

export default function ResultChart({ correct, wrong }: ResultChartProps) {
  const data = {
    labels: ["Correct", "Wrong"],
    datasets: [
      {
        data: [correct, wrong],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  };

  return (
    <div className="max-w-xs mx-auto">
      <Pie data={data} />
    </div>
  );
}
