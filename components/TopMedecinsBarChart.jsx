"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopMedecinsBarChart() {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const from = startDate.toISOString();
    const to = endDate.toISOString();

    fetch(`/api/stats/top-medecins?from=${from}&to=${to}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur serveur lors du chargement des données");
        }
        return res.json();
      })
      .then((data) => {
        setError(null);
        setChartData({
          labels: data.map((m) => m.nom),
          datasets: [
            {
              label: "Rendez-vous (plage personnalisée)",
              data: data.map((m) => m.count),
              backgroundColor: "#10B981",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Erreur:", err.message);
        setError("Impossible de charger les données. Veuillez réessayer.");
        setChartData(null);
      });
  }, [startDate, endDate]);

  return (
    <div className="bg-white rounded shadow p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold">Top médecins par période</h2>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Date de début"
            className="border px-2 py-1 rounded"
          />
          <span>→</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Date de fin"
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {chartData ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        !error && <p className="text-gray-500">Veuillez sélectionner une plage de dates.</p>
      )}
    </div>
  );
}
