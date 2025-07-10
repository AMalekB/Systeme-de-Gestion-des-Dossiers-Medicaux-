'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";

export default function MesPatientsPage() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");

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
        return fetch("/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement patients");
        return res.json();
      })
      .then((data) => {
        setPatients(data);
        setFilteredPatients(data);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  // 🔍 Filtrage dynamique par nom ou prénom
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = patients.filter((p) =>
      p.nom.toLowerCase().includes(lowerSearch) ||
      p.prenom.toLowerCase().includes(lowerSearch)
    );
    setFilteredPatients(filtered);
  }, [search, patients]);

  const handleVoirDossier = (patientId) => {
    router.push(`/medecin/dossiers/${patientId}`);
  };

  if (!autorise) return null;

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Liste des patients</h2>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Recherche (nom ou prénom)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Prénom</th>
              <th className="py-2 px-4 text-left">Date de naissance</th>
              <th className="py-2 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4">{p.nom}</td>
                <td className="py-2 px-4">{p.prenom}</td>
                <td className="py-2 px-4">
                  {new Date(p.dateNaissance).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleVoirDossier(p.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Dossier médical
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Aucun patient trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </LayoutDashboard>
  );
}
