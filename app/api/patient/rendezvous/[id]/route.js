import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const rdvId = parseInt(params.id);

  const patient = await prisma.patient.findUnique({
    where: { utilisateurId: payload.id },
  });

  const rendezvous = await prisma.rendezVous.findFirst({
    where: {
      id: rdvId,
      patientId: patient?.id,
    },
    include: {
      medecin: true,
    },
  });

  if (!rendezvous) {
    return NextResponse.json({ message: "Rendez-vous introuvable" }, { status: 404 });
  }

  return NextResponse.json(rendezvous);
}

export async function PUT(req, { params }) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const rdvId = parseInt(params.id);
  const body = await req.json();
  const { date, heure, typeConsultation, rappel, medecinId } = body;

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
      medecinId: parseInt(medecinId),
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
