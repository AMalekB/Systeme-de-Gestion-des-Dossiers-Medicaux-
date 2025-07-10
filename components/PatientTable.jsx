'use client'
import { useEffect, useState } from 'react'
import PatientModal from './PatientModal'
import { FaEdit, FaTrash } from "react-icons/fa";

export default function PatientTable() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // 🔄 Charger la liste des patients
  const fetchPatients = async () => {
    const res = await fetch('/api/patients', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    setPatients(data)
    setFilteredPatients(data)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // 🔍 Filtrage dynamique : nom, prénom, téléphone, adresse
  useEffect(() => {
    const lowerSearch = search.toLowerCase()
    const filtered = patients.filter((p) =>
      p.nom.toLowerCase().includes(lowerSearch) ||
      p.prenom.toLowerCase().includes(lowerSearch) ||
      p.telephone.includes(search) ||
      p.adresse.toLowerCase().includes(lowerSearch)
    )
    setFilteredPatients(filtered)
  }, [search, patients])

  // ✅ Ajouter ou modifier
  const handleSave = async (formData) => {
    const method = selectedPatient ? 'PATCH' : 'POST'
    const url = selectedPatient ? `/api/patients/${selectedPatient.id}` : '/api/patients'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      await fetchPatients()
      setShowModal(false)
      setSelectedPatient(null)
    } else {
      alert('Erreur lors de la sauvegarde')
    }
  }

  // ❌ Supprimer
  const handleDelete = async (id) => {
    if (!confirm('Confirmer la suppression ?')) return

    const res = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      await fetchPatients()
    } else {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="overflow-x-auto text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => { setShowModal(true); setSelectedPatient(null) }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          title="Ajouter un patient"
        >
          + Ajouter un patient
        </button>

        <input
          type="text"
          placeholder="Recherche (nom, prénom, téléphone, adresse)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-80"
        />
      </div>

      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Prénom</th>
            <th className="py-2 px-4 text-left">Date de naissance</th>
            <th className="py-2 px-4 text-left">Téléphone</th>
            <th className="py-2 px-4 text-left">Adresse</th>
            <th className="py-2 px-4 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.nom}</td>
              <td className="py-2 px-4">{p.prenom}</td>
              <td className="py-2 px-4">{new Date(p.dateNaissance).toLocaleDateString()}</td>
              <td className="py-2 px-4">{p.telephone}</td>
              <td className="py-2 px-4">{p.adresse}</td>
              <td className="py-2 px-4 space-x-2">
  <button 
    onClick={() => {
      setSelectedPatient(p);
      setShowModal(true);
    }}
    className="text-blue-500 hover:text-blue-700 transition"
    title="Modifier"
  >
    <FaEdit />
  </button>

  <button
    onClick={() => handleDelete(p.id)}
    className="text-red-500 hover:text-red-700 transition"
    title="Supprimer"
  >
    <FaTrash />
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PatientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        patient={selectedPatient}
      />
    </div>
  )
}
