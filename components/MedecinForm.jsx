// ✅ MedecinForm.jsx
'use client'
import { useState, useEffect } from 'react'

export default function MedecinForm({ onSubmit, onCancel, medecin = null }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    specialite: '',
  })

  useEffect(() => {
    if (medecin) {
      setFormData({
        nom: medecin.utilisateur.nom,
        email: medecin.utilisateur.email,
        motDePasse: '', // champ vide par défaut
        specialite: medecin.specialite,
      })
    }
  }, [medecin])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Mot de passe</label>
        <input
          type="password"
          name="motDePasse"
          value={formData.motDePasse}
          onChange={handleChange}
          required={!medecin}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Spécialité</label>
        <input
          type="text"
          name="specialite"
          value={formData.specialite}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:underline"
          >Annuler</button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {medecin ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}
