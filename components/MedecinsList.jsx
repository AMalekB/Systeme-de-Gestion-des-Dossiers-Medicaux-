'use client'
import { useEffect, useState } from 'react'
import MedecinModal from './MedecinModal'

export default function MedecinsList() {
  const [medecins, setMedecins] = useState([])
  const [editing, setEditing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchMedecins = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/medecin', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await res.json()
    setMedecins(data)
  }

  useEffect(() => {
    fetchMedecins()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    if (!confirm("Supprimer ce médecin ?")) return
    await fetch(`/api/medecin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    fetchMedecins()
  }

  const handleEdit = (medecin) => {
    setEditing(medecin)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token')
    if (editing) {
      await fetch(`/api/medecin/${editing.utilisateur.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
    } else {
      await fetch('/api/medecin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
    }

    setEditing(null)
    setIsModalOpen(false)
    fetchMedecins()
  }

  const handleCancel = () => {
    setEditing(null)
    setIsModalOpen(false)
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Liste des médecins</h2>

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
              <th className="p-3 border-b border-blue-200 text-left font-semibold">Nom</th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">Email</th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">Spécialité</th>
              <th className="p-3 border-b border-blue-200 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medecins.map((m, index) => (
              <tr key={m.utilisateur.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border-b border-gray-300 text-gray-800">{m.utilisateur.nom}</td>
                <td className="p-3 border-b border-gray-300 text-gray-800">{m.utilisateur.email}</td>
                <td className="p-3 border-b border-gray-300 text-gray-800">{m.specialite}</td>
                <td className="p-3 border-b border-gray-300 space-x-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(m)}
                  >Modifier</button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(m.utilisateur.id)}
                  >Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
