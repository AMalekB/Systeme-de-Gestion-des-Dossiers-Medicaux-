"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from '@/components/LayoutDashboard'

export default function DashboardMedecin() {
  const router = useRouter();
  const [autorisé, setAutorisé] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAutorisé(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!autorisé) return null;

  return (
     <LayoutDashboard>
      <h2 className="text-2xl font-bold mb-4">Bienvenue Médecin</h2>
      <p>Ici, vous pouvez consulter vos patients, gérer les dossiers médicaux et les rendez-vous.</p>
    </LayoutDashboard>
  );
}
