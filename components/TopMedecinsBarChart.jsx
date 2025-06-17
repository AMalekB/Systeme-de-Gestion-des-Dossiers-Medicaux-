"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopMedecinsBarChart({ startDate, endDate, refreshKey }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const from = startDate.toISOString();
    const to = endDate.toISOString();

    fetch(`/api/stats/top-medecins?from=${from}&to=${to}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Erreur serveur")))
      .then((data) => {
        setChartData({
          labels: data.map((m) => m.nom),
          datasets: [
            {
              label: "Rendez-vous (plage sélectionnée)",
              data: data.map((m) => m.count),
              backgroundColor: "#10B981",
            },
          ],
        });
      })
      .catch(() => setChartData(null));
  }, [startDate, endDate, refreshKey]);

  return (
    <div className="bg-white p-6 rounded shadow h-full flex items-center justify-center">
      {chartData && chartData.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                ticks: { stepSize: 1, precision: 0 },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-500">Aucune donnée disponible pour la période sélectionnée.</p>
      )}
    </div>
  );
}
