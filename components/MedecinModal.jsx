'use client'
import MedecinForm from './MedecinForm'

export default function MedecinModal({ isOpen, onSubmit, onCancel, medecin }) {
  if (!isOpen) return null

  const handleSubmit = async (data) => {
    await onSubmit(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">
          {medecin ? 'Modifier le médecin' : 'Nouveau Médecin'}
        </h2>
        <MedecinForm
          onSubmit={handleSubmit}
          onCancel={onCancel}
          medecin={medecin}
        />
      </div>
    </div>
  )
}
