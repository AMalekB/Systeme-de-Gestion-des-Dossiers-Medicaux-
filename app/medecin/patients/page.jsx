"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import LogoutButton from "@/components/LogoutButton";

export default function MesPatientsPage() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Vérifier le rôle
    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Non autorisé");
        setAutorise(true);
        return fetch("/api/patients");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement patients");
        return res.json();
      })
      .then(setPatients)
      .catch(() => router.push("/login"));
  }, [router]);

  if (!autorise) return null;

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Mes Patients</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-black">
          Liste de mes patients
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-black">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Nom</th>
                <th className="p-3 border">Prénom</th>
                <th className="p-3 border">Date de naissance</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{p.id}</td>
                  <td className="p-3 border">{p.nom}</td>
                  <td className="p-3 border">{p.prenom}</td>
                  <td className="p-3 border">
                    {new Date(p.dateNaissance).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucun patient trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutDashboard>
  );
}
