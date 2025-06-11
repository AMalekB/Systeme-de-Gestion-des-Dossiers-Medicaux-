'use client'
import { useEffect, useState } from 'react'
import RendezvousModal from './RendezvousModal'

export default function RendezvousList() {
  const [rendezvousList, setRendezvousList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchRendezvous = async () => {
    try {
      const res = await fetch('/api/rendezvous', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (Array.isArray(data)) {
        setRendezvousList(data)
        setFilteredList(data)
      } else {
        console.error("Réponse inattendue :", data)
        setRendezvousList([])
        setFilteredList([])
      }
    } catch (err) {
      console.error("Erreur de chargement :", err)
    }
  }

  useEffect(() => {
    fetchRendezvous()
  }, [])

  // 🔍 Recherche dynamique
  useEffect(() => {
    const lower = search.toLowerCase()
    const filtered = rendezvousList.filter(r =>
      `${r.patient?.nom} ${r.patient?.prenom}`.toLowerCase().includes(lower) ||
      r.medecin?.utilisateur?.nom?.toLowerCase().includes(lower)
    )
    setFilteredList(filtered)
  }, [search, rendezvousList])

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
        Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    })

    setEditing(null)
    fetchRendezvous()
  }

  return (
    <div className="overflow-x-auto text-gray-800">
      <div className="flex justify-between items-center mb-4">
        {!editing && <RendezvousModal onSubmit={handleSubmit} />}
  <input
    type="text"
    placeholder="Rechercher par patient ou médecin..."
    className="border px-4 py-2 rounded w-80"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  
</div>

      {editing && (
        <RendezvousModal
          onSubmit={handleSubmit}
          rendezvous={editing}
          onCancelEdit={() => setEditing(null)}
        />
      )}

      <div className="overflow-x-auto mt-4">
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-500">Aucun rendez-vous trouvé.</p>
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
              {filteredList.map((r, index) => (
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
                    <button onClick={() => setEditing(r)} className="text-blue-600 hover:underline">
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">
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
