"use client";
import { useEffect, useState } from "react";

export default function RendezvousDayModal({ date, onClose, onEdit, onDelete }) {
  const [rendezvousList, setRendezvousList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔁 Fonction réutilisable pour recharger la liste du jour
  const fetchRendezvousForDay = async () => {
    if (!token || !date) return;

    setLoading(true);
    try {
      const res = await fetch("/api/rendezvous", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Non autorisé");

      const all = await res.json();
      const filtered = Array.isArray(all)
        ? all.filter((r) => r.date?.startsWith(date))
        : [];

      setRendezvousList(filtered);
    } catch (err) {
      console.error("Erreur chargement rdv jour :", err);
      setRendezvousList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRendezvousForDay();
  }, [date, token]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Rendez-vous du {date}
        </h2>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : rendezvousList.length === 0 ? (
          <p className="text-gray-500">Aucun rendez-vous planifié</p>
        ) : (
          <ul className="space-y-4">
            {rendezvousList.map((rdv) => (
              <li
                key={rdv.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="text-sm">
                    🕒 {rdv.heure} – {rdv.typeConsultation}
                  </p>
                  <p className="text-xs text-gray-500">
                    👤 {rdv.patient?.nom} {rdv.patient?.prenom} | 👨‍⚕️ {rdv.medecin?.utilisateur?.nom}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => onEdit(rdv)}
                  >
                    Modifier
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={async () => {
                      await onDelete(rdv.id);
                      fetchRendezvousForDay(); // 🔁 recharge après suppression
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
