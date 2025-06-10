// ✅ PatientTable.jsx - Liste, Ajout, Édition, Suppression
'use client'
import { useEffect, useState } from 'react'
import PatientModal from './PatientModal'

export default function PatientTable() {
  const [patients, setPatients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  // 🔄 Charger la liste des patients
  const fetchPatients = async () => {
    const res = await fetch('/api/patients')
    const data = await res.json()
    setPatients(data)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // ✅ Ajouter ou modifier un patient
  const handleSave = async (formData) => {
    const method = selectedPatient ? 'PUT' : 'POST'
    const url = selectedPatient ? `/api/patients/${selectedPatient.id}` : '/api/patients'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
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

  // ❌ Supprimer un patient
  const handleDelete = async (id) => {
    if (!confirm('Confirmer la suppression ?')) return

    const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' })
    if (res.ok) {
      await fetchPatients()
    } else {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="overflow-x-auto text-gray-800">
      <button
        onClick={() => { setShowModal(true); setSelectedPatient(null) }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Ajouter un patient
      </button>


      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Prénom</th>
            <th className="py-2 px-4 text-left">Date de naissance</th>
            <th className="py-2 px-4 text-left">Téléphone</th>
            <th className="py-2 px-4 text-left">Adresse</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.nom}</td>
              <td className="py-2 px-4">{p.prenom}</td>
              <td className="py-2 px-4">{new Date(p.dateNaissance).toLocaleDateString()}</td>
              <td className="py-2 px-4">{p.telephone}</td>
              <td className="py-2 px-4">{p.adresse}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => { setSelectedPatient(p); setShowModal(true) }}
                  className="text-blue-500 hover:underline"
                >Modifier</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:underline"
                >Supprimer</button>
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
