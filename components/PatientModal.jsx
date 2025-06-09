'use client'
import PatientForm from './PatientForm'

export default function PatientModal({ isOpen, onClose, onSubmit, patient }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {patient ? 'Modifier le patient' : 'Ajouter un patient'}
        </h2>
        <PatientForm
          onSubmit={onSubmit}
          onCancel={onClose}
          patient={patient}
        />
      </div>
    </div>
  )
}
