// app/api/patients/[patientId]/prescriptions/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function POST(request, context) {
  // 1️⃣ Lire le paramètre dynamic
  const { patientId: patientIdStr } = await context.params;
  const patientId = parseInt(patientIdStr, 10);

  // 2️⃣ Authentifier + vérifier rôle
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  // → Récupère l’ID du médecin depuis le token (assure-toi que ton JWT contient bien userId)
  const medecinId = payload.userId || payload.id;

  try {
    // 3️⃣ Lecture de la description
    const { description } = await request.json();

    // 4️⃣ Cherche ou crée le dossier – UNIQUEMENT via patientId
    let dossier = await prisma.dossierMedical.findUnique({
      where: { patientId },
    });

    if (!dossier) {
      dossier = await prisma.dossierMedical.create({
        data: {
          patientId,
          historiqueMedical: "",
          notesMedecin: "",
        },
      });
    }

    // 5️⃣ Création de la prescription (ici medecinId existe toujours sur Prescription)
    const newPrescription = await prisma.prescription.create({
      data: {
        date: new Date(),
        description,
        dossierId: dossier.id,
        medecinId,
      },
    });

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (err) {
    console.error("Erreur POST /prescriptions :", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
