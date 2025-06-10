// ✅ MedecinModal.jsx
'use client'
import { useState } from 'react'
import MedecinForm from './MedecinForm'

export default function MedecinModal({ onSubmit }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data) => {
    await onSubmit(data)
    setOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
      >
        ➕ Ajouter un médecin
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Nouveau Médecin</h2>
            <MedecinForm
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}