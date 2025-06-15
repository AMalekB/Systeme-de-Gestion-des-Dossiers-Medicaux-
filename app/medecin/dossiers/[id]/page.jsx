"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";

export default function DossierMedicalPage() {
  const params = useParams();
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const patientId = params.id;

  const chargerPatient = async (token) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erreur chargement dossier patient");
      const data = await res.json();
      setPatient(data);
      setIsLoading(false);
    } catch {
      router.push("/login");
    }
  };

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
        if (!res.ok) throw new Error("Non autorisé");
        setAutorise(true);
        return chargerPatient(token);
      })
      .catch(() => router.push("/login"));
  }, [router, patientId]);

  if (!autorise) return null;
  if (isLoading)
    return <LayoutDashboard>Chargement du dossier...</LayoutDashboard>;

  if (!patient)
    return (
      <LayoutDashboard>
        <p>Patient non trouvé.</p>
      </LayoutDashboard>
    );

  // Récupère les prescriptions depuis le dossier
  const prescriptions = patient.dossierMedical?.prescriptions || [];

  return (
    <LayoutDashboard>
      <h2 className="text-2xl font-bold mb-4 text-black">
        Dossier médical de {patient.nom} {patient.prenom}
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6 text-black">
        <h3 className="text-xl font-semibold mb-3">Informations du patient</h3>
        <p>
          <strong>ID :</strong> {patient.id}
        </p>
        <p>
          <strong>Date de naissance :</strong>{" "}
          {new Date(patient.dateNaissance).toLocaleDateString()}
        </p>
        <p>
          <strong>Téléphone :</strong> {patient.telephone}
        </p>
        <p>
          <strong>Adresse :</strong> {patient.adresse}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3 text-black">
          Historique médical
        </h3>
        <p>
          {patient.dossierMedical?.historiqueMedical ||
            "Aucun historique disponible."}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-3 text-black">Prescriptions</h3>
        {prescriptions.length > 0 ? (
          <ul className="list-disc pl-5 text-black">
            {prescriptions.map((presc) => (
              <li key={presc.id}>
                {new Date(presc.date).toLocaleDateString()} -{" "}
                {presc.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune prescription disponible.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-3 text-black">
          Ajouter une prescription
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");
            const description = e.target.description.value;

            const res = await fetch(
              `/api/patients/${patientId}/prescriptions`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ description }),
              }
            );

            console.log("POST /prescriptions status:", res.status);

            if (res.ok) {
              await chargerPatient(token);
              e.target.reset();
            } else {
              alert("Erreur lors de l'ajout de la prescription.");
            }
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter
          </button>
        </form>
      </div>
    </LayoutDashboard>
  );
}
