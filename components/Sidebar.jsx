'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image';

export default function Sidebar() {
  const [role, setRole] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const navItems = {
    ADMIN: [
      { label: 'Tableau de bord', path: '/admin/dashboard', icon: '📊' },
      { label: 'Patients', path: '/admin/patients', icon: '🧑' },
      { label: 'Médecins', path: '/admin/medecins', icon: '👨‍⚕️' },
      { label: 'Rendez-vous', path: '/admin/rendezvous', icon: '📅' },
    ],
    MEDECIN: [
      { label: 'Tableau de bord', path: '/medecin/dashboard', icon: '📊' },
      { label: 'Patients', path: '/medecin/patients', icon: '🧑‍🤝‍🧑' },
      { label: 'Mes Rendez-vous', path: '/medecin/rendezvous', icon: '📆' },
    ],
  }

  const links = navItems[role] || [];

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-3 text-gray-700 dark:text-white fixed top-4 left-4 z-50 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-66 h-screen transition-transform bg-white dark:bg-gray-900 shadow-md transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="h-full p-5 overflow-y-auto">
          <Image
            src="/images/SGDM.webp"
            alt="Logo"
            width={300}
            height={150}
            className="mb-6"/>
          <ul className="space-y-4">
            {links.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    router.push(item.path)
                    setIsOpen(false) // Fermer sidebar mobile après navigation
                  }}
                  className="flex items-center w-full p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-400 dark:hover:bg-gray-700 transition"
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-xl font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Décalage du contenu principal sur grand écran */}
      <div className="sm:ml-64" />
    </>
  )
}
