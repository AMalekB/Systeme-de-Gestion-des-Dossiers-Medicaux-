// ✅ Route API: GET et POST medecins - app/api/medecins/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyJwtAndRole } from '@/lib/auth'

const prisma = new PrismaClient()

// 🔍 GET : Récupérer tous les médecins
export async function GET() {
  try {
    const medecins = await prisma.medecin.findMany({
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    })
    return NextResponse.json(medecins)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur lors de la récupération des médecins' }, { status: 500 })
  }
}

// ➕ POST : Créer un médecin (utilisateur + spécialité)
export async function POST(req) {
  const { error, payload } = verifyJwtAndRole(req, 'ADMIN')
  if (error) return error

  const data = await req.json()
  const { nom, email, motDePasse, specialite } = data

  try {
    const newMedecin = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        motDePasse, // 🔐 en production, hasher !
        role: 'MEDECIN',
        medecin: {
          create: {
            specialite,
          },
        },
      },
      include: {
        medecin: true,
      },
    })

    return NextResponse.json(newMedecin)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur lors de la création du médecin' }, { status: 500 })
  }
}

