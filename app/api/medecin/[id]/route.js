// ✅ Route API: PUT et DELETE - app/api/medecins/[id]/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyJwtAndRole } from '@/lib/auth'

const prisma = new PrismaClient()

// ✏️ PUT : Modifier un médecin
export async function PUT(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const id = parseInt(params.id)
  const data = await req.json()
  const { nom, email, motDePasse, specialite } = data

  try {
    const updatedUser = await prisma.utilisateur.update({
      where: { id },
      data: {
        nom,
        email,
        motDePasse, // 🔐 hasher en prod
      },
    })

    const updatedMedecin = await prisma.medecin.update({
      where: { utilisateurId: id },
      data: { specialite },
    })

    return NextResponse.json({ ...updatedUser, medecin: updatedMedecin })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur mise à jour médecin' }, { status: 500 })
  }
}

// ❌ DELETE : Supprimer un médecin (et l'utilisateur lié)
export async function DELETE(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const id = parseInt(params.id)

  try {
    // Supprime le medecin puis l'utilisateur
    await prisma.medecin.delete({ where: { utilisateurId: id } })
    await prisma.utilisateur.delete({ where: { id } })

    return NextResponse.json({ message: 'Médecin supprimé' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur suppression médecin' }, { status: 500 })
  }
}
