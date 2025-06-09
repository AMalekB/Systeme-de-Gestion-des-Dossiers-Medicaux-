'use client'
import { useState } from 'react'

export default function PatientForm({ onSubmit, patient, onCancel }) {
  // Protection contre un patient null ou undefined
  const safePatient = patient || {}

  const [formData, setFormData] = useState({
    nom: safePatient.nom || '',
    prenom: safePatient.prenom || '',
    dateNaissance: safePatient.dateNaissance || '',
    telephone: safePatient.telephone || '',
    adresse: safePatient.adresse || '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['nom', 'prenom', 'telephone'].map((field) => (
        <div key={field}>
          <label className="block font-medium">{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}

      <div>
        <label className="block font-medium">Date de naissance</label>
        <input
          type="date"
          name="dateNaissance"
          value={formData.dateNaissance?.substring(0, 10) || ''}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
  <label className="block font-medium">Adresse</label>
  <input
    type="text"
    name="adresse"
    value={formData.adresse}
    onChange={handleChange}
    required
    className="w-full border rounded px-3 py-2"
  />
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
