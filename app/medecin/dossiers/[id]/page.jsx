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
        return fetch(`/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement dossier patient");
        return res.json();
      })
      .then((data) => {
        setPatient(data);
        setIsLoading(false);
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
        {/* Exemple : à enrichir avec les vraies données du dossier */}
        <p>{patient.historique || "Aucun historique disponible."}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-black">Prescriptions</h3>
        {/* Exemple : afficher les prescriptions si ton API les renvoie */}
        {patient.prescriptions && patient.prescriptions.length > 0 ? (
          <ul className="list-disc pl-5">
            {patient.prescriptions.map((prescription) => (
              <li key={prescription.id}>
                {new Date(prescription.date).toLocaleDateString()} -{" "}
                {prescription.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune prescription disponible.</p>
        )}
      </div>
    </LayoutDashboard>
  );
}
