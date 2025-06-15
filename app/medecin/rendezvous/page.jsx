"use client";

import { useState, useEffect } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import LogoutButton from "@/components/LogoutButton";

export default function MedecinRendezVous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Non authentifié");
      setIsLoading(false);
      return;
    }

    fetch("/api/medecin/rendezvous", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement rendez-vous");
        return res.json();
      })
      .then((data) => {
        setRendezVous(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes Rendez-vous</h2>
      </div>

      {isLoading ? (
        <p>Chargement des rendez-vous...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Heure</th>
                <th className="p-3 border text-left">Patient</th>
                <th className="p-3 border text-left">Type</th>
                <th className="p-3 border text-left">Rappel</th>
              </tr>
            </thead>
            <tbody>
              {rendezVous.length > 0 ? (
                rendezVous.map((rv) => (
                  <tr key={rv.id} className="hover:bg-gray-100">
                    <td className="p-3 border">
                      {new Date(rv.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">{rv.heure}</td>
                    <td className="p-3 border">
                      {rv.patient.nom} {rv.patient.prenom}
                    </td>
                    <td className="p-3 border">{rv.typeConsultation}</td>
                    <td className="p-3 border">{rv.rappel ? "Oui" : "Non"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Aucun rendez-vous trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </LayoutDashboard>
  );
}
