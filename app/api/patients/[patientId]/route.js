// app/api/patients/[patientId]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function GET(request, context) {
  // 1️⃣ Authentification + vérification de rôle
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  // 2️⃣ Lecture des params dynamiques (await requis)
  const params = await context.params;
  const id = Number(params.patientId);

  try {
    // 3️⃣ Charger le patient avec dossier, prescriptions, historique, rendez-vous et allergies
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        dossierMedical: {
          include: {
            prescriptions: {
              include: {
                medecin: {
                  include: { utilisateur: { select: { nom: true } } },
                },
                items: { include: { medicament: true } },
              },
              orderBy: { date: "desc" },
            },
            historique: {
              include: {
                medecin: {
                  include: { utilisateur: { select: { nom: true } } },
                },
              },
              orderBy: { date: "desc" },
            },
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
