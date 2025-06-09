'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function Header() {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/login')
  }

  return (
    <header className="bg-white text-black shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Tableau de bord {role}</h1>
      <LogoutButton/>
    </header>
  )
}
