// app/api/patient/rendezvous/[id]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const rdvId = parseInt(params.id);
  const body = await req.json();
  const { date, heure, typeConsultation, rappel } = body;

  const patient = await prisma.patient.findUnique({
    where: { utilisateurId: payload.id },
  });

  const rdv = await prisma.rendezVous.updateMany({
    where: {
      id: rdvId,
      patientId: patient?.id,
    },
    data: {
      date: new Date(date),
      heure,
      typeConsultation,
      rappel: !!rappel,
    },
  });

  return NextResponse.json({ message: "Rendez-vous modifié", rdv });
}

export async function DELETE(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const rdvId = parseInt(params.id);

  const patient = await prisma.patient.findUnique({
    where: { utilisateurId: payload.id },
  });

  await prisma.rendezVous.deleteMany({
    where: {
      id: rdvId,
      patientId: patient?.id,
    },
  });

  return NextResponse.json({ message: "Rendez-vous annulé" });
}
