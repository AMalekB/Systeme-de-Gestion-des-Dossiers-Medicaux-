// app/medecin/dossiers/[id]/pages.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import { useForm, useFieldArray } from "react-hook-form";

export default function DossierMedicalPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id;

  const [autorise, setAutorise] = useState(false);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [medSearch, setMedSearch] = useState("");
  const [medOptions, setMedOptions] = useState([]);

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      description: "",
      items: [
        {
          medicamentId: "",
          dosage: "",
          frequence: "",
          duree: "",
          instructions: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const chargerPatient = async (token) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPatient(data);
      setIsLoading(false);
    } catch {
      router.push("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setAutorise(true);
        return chargerPatient(token);
      })
      .catch(() => router.push("/login"));
  }, [patientId, router]);

  useEffect(() => {
    if (medSearch.length < 2) return setMedOptions([]);
    fetch(`/api/medicaments?search=${encodeURIComponent(medSearch)}`)
      .then((r) => r.json())
      .then(setMedOptions);
  }, [medSearch]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const payload = { description: data.description, items: data.items };
    const res = await fetch(`/api/patients/${patientId}/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      reset({
        description: "",
        items: [
          {
            medicamentId: "",
            dosage: "",
            frequence: "",
            duree: "",
            instructions: "",
          },
        ],
      });
      await chargerPatient(token);
    } else {
      alert("Erreur lors de l'ajout de la prescription.");
    }
  };

  if (!autorise) return null;
  if (isLoading)
    return <LayoutDashboard>Chargement du dossier...</LayoutDashboard>;
  if (!patient)
    return (
      <LayoutDashboard>
        <p>Patient non trouvé.</p>
      </LayoutDashboard>
    );

  const { dossierMedical } = patient;
  const prescriptions = dossierMedical?.prescriptions || [];
  const historique = dossierMedical?.historique || [];

  return (
    <LayoutDashboard>
      <h2 className="text-2xl font-bold mb-4 text-black">
        Dossier médical de {patient.nom} {patient.prenom}
      </h2>

      {/* Infos patient */}
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

      {/* Historique médical libre */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 text-black">
        <h3 className="text-xl font-semibold mb-3">Historique médical</h3>
        <p>
          {dossierMedical.historiqueMedical || "Aucun historique disponible."}
        </p>
      </div>

      {/* Liste des prescriptions */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 text-black">
        <h3 className="text-xl font-semibold mb-3">Prescriptions</h3>
        {prescriptions.length > 0 ? (
          prescriptions.map((p) => {
            const d = new Date(p.date);
            const formattedDate = `${String(d.getDate()).padStart(
              2,
              "0"
            )}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
            return (
              <div key={p.id} className="mb-4 p-4 bg-gray-50 rounded border">
                <div className="text-sm text-gray-600 mb-1">
                  {formattedDate} par Dr {p.medecin.utilisateur.nom}
                </div>
                {p.description && (
                  <p className="italic mb-2">{p.description}</p>
                )}
                <ul className="list-disc pl-5">
                  {p.items.map((it) => (
                    <li key={`${p.id}-${it.medicamentId}`}>
                      <strong>{it.medicament.nom}</strong> — {it.dosage} —{" "}
                      {it.frequence} — {it.duree}
                      {it.instructions && <span> ({it.instructions})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <p>Aucune prescription disponible.</p>
        )}
      </div>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 text-black">
        <h3 className="text-xl font-semibold mb-3">Ajouter une prescription</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("description")}
            placeholder="Description (facultatif)"
            className="w-full border px-3 py-2 rounded"
          />
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-6 gap-2 items-end">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Médicament..."
                  className="col-span-2 border px-2 py-1 rounded"
                  list={`med-list-${idx}`}
                  required
                  onChange={(e) => {
                    const val = e.target.value;
                    setMedSearch(val);
                    const sel = medOptions.find((m) => m.nom === val);
                    setValue(`items.${idx}.medicamentId`, sel ? sel.id : "");
                  }}
                />
                <datalist id={`med-list-${idx}`}>
                  {medOptions.map((m) => (
                    <option key={m.id} value={m.nom} />
                  ))}
                </datalist>
              </div>
              <input
                {...register(`items.${idx}.dosage`)}
                placeholder="Dosage"
                className="border px-2 py-1 rounded"
              />
              <input
                {...register(`items.${idx}.frequence`)}
                placeholder="Fréquence"
                className="border px-2 py-1 rounded"
              />
              <input
                {...register(`items.${idx}.duree`)}
                placeholder="Durée"
                className="border px-2 py-1 rounded"
              />
              <input
                {...register(`items.${idx}.instructions`)}
                placeholder="Instructions"
                className="border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-red-600"
              >
                🗑️
              </button>
            </div>
          ))}
          <div className="flex items-center mt-2 space-x-4">
            <button
              type="button"
              onClick={() =>
                append({
                  medicamentId: "",
                  dosage: "",
                  frequence: "",
                  duree: "",
                  instructions: "",
                })
              }
              className="text-blue-600"
            >
              + Ajouter un médicament
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Enregistrer la prescription
            </button>
          </div>
        </form>
      </div>

      {/* Historique des actions */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6 text-black">
        <h3 className="text-xl font-semibold mb-3">Historique des actions</h3>
        {historique.length > 0 ? (
          <ul className="space-y-2">
            {historique.map((h) => (
              <li key={h.id} className="text-sm">
                <span className="font-medium">
                  {new Date(h.date).toLocaleString()}
                </span>{" "}
                — Dr {h.medecin.utilisateur.nom} :{" "}
                <span className="italic">{h.contenu}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune action enregistrée.</p>
        )}
      </div>
    </LayoutDashboard>
  );
}
