"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from '@/components/LayoutDashboard'
import LogoutButton from "@/components/LogoutButton";

export default function DashboardMedecin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);

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
          setAutorise(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!autorise) return null;

  return (
     <LayoutDashboard>
      <h2 className="text-2xl font-bold mb-4">Bienvenue Médecin</h2>
      <p>Ici, vous pouvez consulter vos patients, gérer les dossiers médicaux et les rendez-vous.</p>
    </LayoutDashboard>
  );
}
