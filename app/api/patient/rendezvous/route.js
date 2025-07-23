// app/api/patient/rendezvous/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const rendezvous = await prisma.rendezVous.findMany({
    where: { patient: { utilisateurId: payload.id } },
    include: {
      medecin: {
        include: { utilisateur: true }
      }
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(rendezvous);
}

export async function POST(req) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const body = await req.json();
  const { date, heure, typeConsultation, rappel, medecinId } = body;

  if (!date || !heure || !typeConsultation || !medecinId) {
    return NextResponse.json({ message: "Champs requis manquants." }, { status: 400 });
  }

  // 🔎 Récupérer le patient via l'utilisateur
  const patient = await prisma.patient.findUnique({
    where: { utilisateurId: payload.id },
  });

  if (!patient) {
    return NextResponse.json({ message: "Patient introuvable." }, { status: 404 });
  }

  const rdv = await prisma.rendezVous.create({
    data: {
      date: new Date(date),
      heure,
      typeConsultation,
      rappel: !!rappel,
      patientId: patient.id,
      medecinId: parseInt(medecinId),
    },
  });

  return NextResponse.json(rdv);
}
