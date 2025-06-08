"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <main className="min-h-screen bg-green-100 text-gray-800">
      <header className="flex items-center justify-between p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold">Dashboard Médecin</h1>
        <LogoutButton />
      </header>

      <section className="flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-semibold mb-4">
          Bienvenue dans le dashboard médecin
        </h2>
        {/* … ajoute ici la liste de tes patients, rendez-vous, etc. … */}
      </section>
    </main>
  );
}
