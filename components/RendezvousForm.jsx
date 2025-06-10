'use client'
import { useState, useEffect } from 'react'

export default function RendezvousForm({ onSubmit, rendezvous = null, onCancel }) {
  const safeRdv = rendezvous || {}

  const [formData, setFormData] = useState({
    date: safeRdv.date ? safeRdv.date.substring(0, 10) : '',
    heure: safeRdv.heure || '',
    typeConsultation: safeRdv.typeConsultation || '',
    rappel: safeRdv.rappel || false,
    patientId: safeRdv.patientId || '',
    medecinId: safeRdv.medecinId || '',
  })

  const [patients, setPatients] = useState([])
  const [medecins, setMedecins] = useState([])

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    fetch('/api/patients', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPatients(data))

    fetch('/api/medecin', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMedecins(data))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Heure</label>
        <input
          type="time"
          name="heure"
          value={formData.heure}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Type de consultation</label>
        <input
          type="text"
          name="typeConsultation"
          value={formData.typeConsultation}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>



      <div>
        <label className="block font-medium">Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Sélectionner un patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom} {p.prenom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Médecin</label>
        <select
          name="medecinId"
          value={formData.medecinId}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Sélectionner un médecin --</option>
          {medecins.map((m) => (
            <option key={m.id} value={m.id}>
              {m.utilisateur.nom} ({m.specialite})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:underline"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  )
}
