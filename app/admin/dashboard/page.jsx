"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import StatistiquesParPeriode from "@/components/StatistiquesParPeriode";

import { FaUser, FaStethoscope, FaCalendarAlt, FaFolderOpen } from "react-icons/fa";

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

  const cards = [
    {
      label: "Patients",
      key: "patients",
      icon: <FaUser className="text-blue-500 text-3xl" />,
    },
    {
      label: "Médecins",
      key: "medecins",
      icon: <FaStethoscope className="text-green-500 text-3xl" />,
    },
    {
      label: "Rendez-vous",
      key: "rendezvous",
      icon: <FaCalendarAlt className="text-purple-500 text-3xl" />,
    },
    
    {
  label: "Rendez-vous aujourd'hui",
  key: "rdv aujourd'hui",
  icon: <FaCalendarAlt className="text-orange-500 text-3xl" />,
}
  ];

  return (
    <LayoutDashboard>
      <h2 className="text-4xl text-gray-800 font-bold mb-4 ">Bonjour Admin!</h2>
      

      {/* 📊 Statistiques globales */}
      {!stats ? (
        <p className="text-gray-600">Chargement des statistiques...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map(({ key, label, icon }) => (
            <div
              key={key}
              className="bg-white p-4 rounded-xl shadow flex items-center gap-4 transition-opacity duration-700 animate-fade-in"
            >
              <div>{icon}</div>
              <div>
                <p className="text-gray-600 text-sm">{label}</p>
                <p className="text-xl text-gray-400 font-semibold">{stats[key]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <StatistiquesParPeriode />
    </LayoutDashboard>
  );
}
