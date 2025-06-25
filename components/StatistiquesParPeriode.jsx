"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import TopMedecinsBarChart from "./TopMedecinsBarChart";
import PieChartSpecialites from "./PieChartSpecialites";


export default function StatistiquesParPeriode() {
  const [periode, setPeriode] = useState("mois");
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Mettre à jour automatiquement les dates si "mois" ou "semaine" est choisi
  useEffect(() => {
    const now = new Date();
    if (periode === "mois") {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    } else if (periode === "semaine") {
      setStartDate(startOfWeek(now, { weekStartsOn: 1 }));
      setEndDate(endOfWeek(now, { weekStartsOn: 1 }));
    }
  }, [periode]);

  const handleApply = () => {
    setTriggerRefresh(Date.now());
  };

  return (
    <div className="mt-8 space-y-6 text-gray-800">
      {/* 📅 Barre de sélection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Statistiques par période</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sélecteur rapide */}
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="mois">Ce mois</option>
            <option value="semaine">Cette semaine</option>
            <option value="personnalisee">Personnalisée</option>
          </select>

          {/* Sélecteurs de dates (activés seulement si personnalisé) */}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            disabled={periode !== "personnalisee"}
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
            disabled={periode !== "personnalisee"}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Date de fin"
            className="border px-2 py-1 rounded"
          />

          {/* Bouton Appliquer */}
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
          >
            Appliquer
          </button>
        </div>
      </div>

      {/* 📈 & 🥧 Graphiques synchronisés côte à côte */}
<div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
  <div className="w-full max-w-[600px] h-[500px]">
    <TopMedecinsBarChart
      startDate={startDate}
      endDate={endDate}
      refreshKey={triggerRefresh}
    />
  </div>
  <div className="w-full max-w-[600px] h-[500px]">
    <PieChartSpecialites
      startDate={startDate}
      endDate={endDate}
      refreshKey={triggerRefresh}
    />
  </div>
</div>
    </div>
  );
}
