"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartSpecialites({ startDate, endDate, refreshKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;
    const from = startDate.toISOString();
    const to = endDate.toISOString();

    fetch(`/api/stats/rendezvous-par-specialite?from=${from}&to=${to}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Erreur serveur")))
      .then((result) => {
        setData({
          labels: result.map((r) => r.specialite),
          datasets: [
            {
              data: result.map((r) => r.count),
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
          ],
        });
      })
      .catch(() => setData(null));
  }, [startDate, endDate, refreshKey]);

  return (
    <div className="bg-white p-6 rounded shadow h-full flex items-center justify-center">
      {data && data.labels.length > 0 ? (
        <Pie data={data} />
      ) : (
        <p className="text-gray-500">Aucune donnée disponible pour la période sélectionnée.</p>
      )}
    </div>
  );
}
