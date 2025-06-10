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

  const modifie = await prisma.rendezVous.update({
    where: { id: parseInt(id) },
    data: {
      date: new Date(date),
      heure,
      typeConsultation,
      rappel,
      patientId,
      medecinId,
    }
  })

  return NextResponse.json(modifie)
}

export async function DELETE(req, { params }) {
  const { error } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const { id } = params

  await prisma.rendezVous.delete({
    where: { id: parseInt(id) },
  })

  return NextResponse.json({ message: 'Supprimé' }, { status: 204 })
}
