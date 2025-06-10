// app/api/rendezvous/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJwtAndRole } from '@/lib/auth'

// 🔍 GET : Lister tous les rendez-vous avec patient + médecin
export async function GET(req) {
  const { error } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const rendezvous = await prisma.rendezVous.findMany({
    include: {
      patient: true,
      medecin: {
        include: {
          utilisateur: true
        }
      }
    },
    orderBy: { date: 'asc' }
  })

  console.log("✅ Renvoi rendezvous :", rendezvous)  // Ajoute ceci

  return NextResponse.json(rendezvous)
}

// 🔄 POST : Créer un nouveau rendez-vous
export async function POST(req) {
  const { error } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const body = await req.json()
  const { date, heure, typeConsultation, rappel, patientId, medecinId } = body

  const nouveau = await prisma.rendezVous.create({
    data: {
      date: new Date(date),
      heure,
      typeConsultation,
      rappel,
      patientId: parseInt(patientId),    // 🔁 Convertir en Int
      medecinId: parseInt(medecinId),    // 🔁 Convertir en Int
    }
  })

  return NextResponse.json(nouveau, { status: 201 })
}
