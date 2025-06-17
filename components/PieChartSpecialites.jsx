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

export default function PieChartSpecialites() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/stats/rendezvous-par-specialite")
      .then((res) => res.json())
      .then((data) => {
        setData({
          labels: data.map((item) => item.specialite || "Non spécifiée"),
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      });
  }, []);

  if (!data) return <p>Chargement du graphique...</p>;

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Répartition des rendez-vous par spécialité</h2>
      <Pie data={data} />
    </div>
  );
}
