// app/api/patients/[id]/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 📝 PUT : Modifier un patient
export async function PUT(req, { params }) {
  const { id } = params
  const data = await req.json()
  const { nom, prenom, dateNaissance, telephone, adresse } = data

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: Number(id) },
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance  + 'T12:00:00'),
        telephone,
        adresse,
      },
    })
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Erreur modification patient' },
      { status: 500 }
    )
  }
}

// ❌ DELETE : Supprimer un patient
export async function DELETE(_, { params }) {
  const { id } = params

  try {
    await prisma.patient.delete({ where: { id: Number(id) } })
    return NextResponse.json({ message: 'Patient supprimé' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Erreur suppression patient' },
      { status: 500 }
    )
  }
}
