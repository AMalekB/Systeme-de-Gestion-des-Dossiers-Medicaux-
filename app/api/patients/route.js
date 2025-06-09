// app/api/patients/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 🔍 GET : Récupérer tous les patients
export async function GET() {
  const patients = await prisma.patient.findMany()
  return NextResponse.json(patients)
}

// ➕ POST : Ajouter un patient
export async function POST(req) {
  const data = await req.json()
  const { nom, prenom, dateNaissance, telephone, adresse } = data

  try {
    const newPatient = await prisma.patient.create({
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance + 'T12:00:00'),
        telephone,
        adresse,
      },
    })
    return NextResponse.json(newPatient)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Erreur création patient' },
      { status: 500 }
    )
  }
}

