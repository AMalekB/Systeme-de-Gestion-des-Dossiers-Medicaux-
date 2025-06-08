"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardAdmin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const user = decodeToken(token);
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    setAutorise(true);

    // → Fetch des médecins une fois autorisé
    fetch("/api/medecins")
      .then((res) => res.json())
      .then((data) => setMedecins(data))
      .catch(console.error);
  }, [router]);

  if (!autorise) return null;

  return (
    <main className="min-h-screen bg-sky-100 text-gray-800">
      <header className="flex items-center justify-between p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <LogoutButton />
      </header>

      <section className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Liste des médecins</h2>
        <table className="w-full table-auto border-collapse bg-white shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Nom</th>
              <th className="p-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {medecins.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-3 border">{m.id}</td>
                <td className="p-3 border">{m.nom}</td>
                <td className="p-3 border">{m.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
