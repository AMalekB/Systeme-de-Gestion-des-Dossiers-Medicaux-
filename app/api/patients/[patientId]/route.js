// app/api/patients/[patientId]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function GET(request, context) {
  // 1️⃣ Authentification + autorisation
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  // 2️⃣ Récupération de l’ID (avec await context.params)
  const params = await context.params;
  const id = Number(params.patientId);

  try {
    // 3️⃣ Charger le patient ET son dossier + ses prescriptions via le dossier
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        dossierMedical: {
          include: {
            prescriptions: true, // ✅ Là où sont les prescriptions
          },
        },
        rendezVous: true,
        allergies: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Patient non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (err) {
    console.error("Erreur GET patient :", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
