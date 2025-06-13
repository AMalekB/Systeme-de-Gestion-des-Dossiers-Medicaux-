import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function POST(req, context) {
  // Correction App Router
  const params = await context.params;
  const patientId = parseInt(params.id, 10);

  // Correction verifyJwtAndRole
  const { error, payload } = verifyJwtAndRole(req, "MEDECIN");

  if (error) return error;

  try {
    const body = await req.json();

    // Récupérer le dossier médical du patient pour ce médecin
    const dossier = await prisma.dossierMedical.findFirst({
      where: { patientId, medecinId: payload.userId },
    });

    if (!dossier) {
      return NextResponse.json(
        { message: "Dossier non trouvé" },
        { status: 404 }
      );
    }

    // Créer la prescription
    const newPrescription = await prisma.prescription.create({
      data: {
        date: new Date(),
        description: body.description,
        dossierId: dossier.id,
        medecinId: payload.userId,
      },
    });

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /prescriptions :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
