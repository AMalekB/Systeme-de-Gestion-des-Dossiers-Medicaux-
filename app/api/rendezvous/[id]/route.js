// app/api/rendezvous/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAndRole } from '@/lib/auth'

export async function PUT(req, { params }) {
  const { error } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const { id } = params
  const body = await req.json()
  const { date, heure, typeConsultation, rappel, patientId, medecinId } = body

  try {
    const modifie = await prisma.rendezVous.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        heure,
        typeConsultation,
        rappel,
        patientId: Number(patientId),
        medecinId: Number(medecinId),
      }
    })

    return NextResponse.json(modifie)
  } catch (err) {
    console.error("Erreur PUT rendez-vous:", err)
    return NextResponse.json({ message: 'Erreur modification rendez-vous' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { error } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const { id } = params

  try {
    await prisma.rendezVous.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Supprimé' }, { status: 204 })
  } catch (err) {
    console.error("Erreur DELETE rendez-vous:", err)
    return NextResponse.json({ message: 'Erreur suppression rendez-vous' }, { status: 500 })
  }
}
