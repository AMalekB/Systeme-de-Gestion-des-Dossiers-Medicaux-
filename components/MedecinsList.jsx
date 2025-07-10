"use client";
import { useEffect, useState } from "react";
import MedecinModal from "./MedecinModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function MedecinsList() {
  const [medecins, setMedecins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(""); // 🔍 nouveau champ
  const [filtered, setFiltered] = useState([]);

  const fetchMedecins = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/medecin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMedecins(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchMedecins();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = medecins.filter(
      (m) =>
        m.utilisateur.nom.toLowerCase().includes(lower) ||
        m.specialite.toLowerCase().includes(lower)
    );
    setFiltered(filteredList);
  }, [search, medecins]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Supprimer ce médecin ?")) return;
    await fetch(`/api/medecin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchMedecins();
  };

  const handleEdit = (medecin) => {
    setEditing(medecin);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    const url = editing
      ? `/api/medecin/${editing.utilisateur.id}`
      : "/api/medecin";

    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setEditing(null);
    setIsModalOpen(false);
    fetchMedecins();
  };

  const handleCancel = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          + Ajouter un médecin
        </button>
        <input
          type="text"
          placeholder="Rechercher par nom ou spécialité..."
          className="border px-4 py-2 rounded w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <MedecinModal
        onSubmit={handleFormSubmit}
        medecin={editing}
        isOpen={isModalOpen}
        onCancel={handleCancel}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">
                Nom
              </th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">
                Email
              </th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">
                Spécialité
              </th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, index) => (
              <tr
                key={m.utilisateur.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border-b border-gray-300 text-gray-800">
                  {m.utilisateur.nom}
                </td>
                <td className="p-3 border-b border-gray-300 text-gray-800">
                  {m.utilisateur.email}
                </td>
                <td className="p-3 border-b border-gray-300 text-gray-800">
                  {m.specialite}
                </td>
                <td className="p-3 border-b border-gray-300">
                  <div className="flex items-center gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => handleEdit(m)}
                      title="Modifier"
                      aria-label="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDelete(m.utilisateur.id)}
                      title="Supprimer"
                      aria-label="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
