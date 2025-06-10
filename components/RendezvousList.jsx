'use client'
import { useEffect, useState } from 'react'
import RendezvousModal from './RendezvousModal'

export default function RendezvousList() {
  const [rendezvousList, setRendezvousList] = useState([])
  const [editing, setEditing] = useState(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchRendezvous = async () => {
    try {
      const res = await fetch('/api/rendezvous', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      // ✅ Vérifie si data est un tableau
      if (Array.isArray(data)) {
        setRendezvousList(data)
      } else {
        console.error("Réponse inattendue (pas un tableau) :", data)
        setRendezvousList([])
      }
    } catch (err) {
      console.error("Erreur lors du chargement des rendez-vous :", err)
      setRendezvousList([])
    }
  }

  useEffect(() => {
    fetchRendezvous()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return
    await fetch(`/api/rendezvous/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchRendezvous()
  }

  const handleSubmit = async (formData) => {
    const method = editing ? 'PUT' : 'POST'
    const url = editing
      ? `/api/rendezvous/${editing.id}`
      : '/api/rendezvous'

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    setEditing(null)
    fetchRendezvous()
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow">
      {!editing && <RendezvousModal onSubmit={handleSubmit} />}

      {editing && (
        <RendezvousModal
          onSubmit={handleSubmit}
          rendezvous={editing}
          onCancelEdit={() => setEditing(null)}
        />
      )}

      <div className="overflow-x-auto mt-4">
        {rendezvousList.length === 0 ? (
          <p className="text-center text-gray-500">Aucun rendez-vous pour le moment.</p>
        ) : (
          <table className="w-full bg-white border border-gray-300 rounded-xl">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Date</th>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Heure</th>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Consultation</th>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Patient</th>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Médecin</th>
                <th className="p-3 border-b border-blue-200 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rendezvousList.map((r, index) => (
                <tr key={r.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 border-b border-gray-300 text-black">{r.date?.substring(0, 10)}</td>
                  <td className="p-3 border-b border-gray-300 text-black">{r.heure}</td>
                  <td className="p-3 border-b border-gray-300 text-black">{r.typeConsultation}</td>
                  <td className="p-3 border-b border-gray-300 text-black">
                    {r.patient?.nom} {r.patient?.prenom}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-black">
                    {r.medecin?.utilisateur?.nom}
                  </td>
                  <td className="p-3 border-b border-gray-300 space-x-3">
                    <button
                      onClick={() => setEditing(r)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
