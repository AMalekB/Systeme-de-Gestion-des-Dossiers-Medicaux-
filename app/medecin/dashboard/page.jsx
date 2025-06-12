"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardMedecin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 1️⃣ Vérification d’accès côté API
    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Non autorisé");
        setAutorise(true);
        // 2️⃣ Récupération de la liste des patients
        return fetch("/api/patients");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les patients");
        return res.json();
      })
      .then((data) => setPatients(data))
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!autorise) return null;

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Bienvenue Médecin</h2>
      </div>

      <p className="mb-6 text-black">
        Ici, vous pouvez consulter vos patients, gérer les dossiers médicaux et
        les rendez-vous.
      </p>
    </LayoutDashboard>
  );
}
