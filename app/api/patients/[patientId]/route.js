// app/api/patients/[patientId]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function GET(request, { params }) {
  // 1️⃣ Authentification & autorisation
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  // 2️⃣ Récupération de l'ID du patient
  const id = Number(params.patientId);

  try {
    // 3️⃣ Chargement du patient avec relations
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        dossierMedical: {
          include: {
            prescriptions: {
              include: {
                medecin: {
                  include: {
                    utilisateur: { select: { nom: true } },
                  },
                },
                items: { include: { medicament: true } },
              },
              orderBy: { date: "desc" },
            },
            historique: {
              include: {
                medecin: {
                  include: {
                    utilisateur: { select: { nom: true } },
                  },
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

// PUT et DELETE restent inchangés
export async function PUT(request, { params }) {
  const id = Number(params.patientId);
  const data = await request.json();
  const { nom, prenom, dateNaissance, telephone, adresse } = data;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance),
        telephone,
        adresse,
      },
    });
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Erreur PUT patient :", error);
    return NextResponse.json(
      { message: "Erreur modification patient", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = Number(params.patientId);

  try {
    await prisma.prescription.deleteMany({
      where: { dossier: { patientId: id } },
    });
    await prisma.dossierMedical.deleteMany({ where: { patientId: id } });
    await prisma.rendezVous.deleteMany({ where: { patientId: id } });
    await prisma.allergie.deleteMany({ where: { patientId: id } });
    await prisma.patient.delete({ where: { id } });

    return NextResponse.json({ message: "Patient supprimé" });
  } catch (error) {
    console.error("Erreur DELETE patient :", error);
    return NextResponse.json(
      { message: "Erreur suppression patient", details: error.message },
      { status: 500 }
    );
  }
}
