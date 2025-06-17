"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import PieChartSpecialites from "@/components/PieChartSpecialites"; // Graphe circulaire

export default function DashboardAdmin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAutorise(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (autorise) {
      fetch("/api/stats/globals")
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [autorise]);

  if (!autorise) return null;

  return (
    <LayoutDashboard>
      <h2 className="text-2xl text-black font-bold mb-4">Bienvenue Admin</h2>
      <p className="text-black mb-6">Ici, vous pouvez consulter tous.</p>

      {/* 📊 Statistiques globales */}
      {!stats ? (
        <p className="text-gray-600">Chargement des statistiques...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded shadow">
              <p className="text-gray-600 capitalize">{key}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🥧 Diagramme circulaire par spécialité */}
      <PieChartSpecialites />
    </LayoutDashboard>
  );
}
