'use client';
import { useState } from 'react';
import RendezvousForm from './RendezvousForm';

export default function RendezvousModal({
  onSubmit,
  rendezvous = null,
  triggerLabel = '➕ Ajouter un rendez-vous',
  onCancelEdit,
}) {
  const [open, setOpen] = useState(false);

  const isEditing = Boolean(rendezvous?.id); // nouveau ou modification

  const handleSubmit = async (data) => {
    await onSubmit(data);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div>
      {!rendezvous && triggerLabel && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
        >
          {triggerLabel}
        </button>
      )}

      {(open || rendezvous) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-xl">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? 'Modifier le rendez-vous' : 'Nouveau Rendez-vous'}
            </h2>
            <RendezvousForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              rendezvous={rendezvous}
            />
          </div>
        </div>
      )}
    </div>
  );
}
