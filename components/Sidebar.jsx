'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  const navItems = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Patients', path: '/admin/patients' },
    { label: 'Dossiers médicaux', path: '/admin/dossiers' },
    { label: 'Utilisateurs', path: '/admin/utilisateurs' },
    { label: 'Rendez-vous', path: '/admin/rendezvous' },
    { label: 'Statistiques', path: '/admin/statistiques' },
  ],
  MEDECIN: [
    { label: 'Dashboard', path: '/medecin/dashboard' },
    { label: 'Mes Patients', path: '/medecin/patients' },
    { label: 'Dossiers médicaux', path: '/medecin/dossiers' },
    { label: 'Prescriptions', path: '/medecin/prescriptions' },
    { label: 'Rendez-vous', path: '/medecin/rendezvous' },
  ],
}

  const links = navItems[role] || []

  return (
    <aside className="w-64 bg-white shadow h-screen p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Clinique</h2>
      <ul className="space-y-4">
        {links.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => router.push(item.path)}
              className="text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
