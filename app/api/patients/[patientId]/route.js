import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

// 🔍 GET : Détails d’un patient
export async function GET(request, context) {
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  const params = await context.params;
  const id = Number(params.patientId);

  try {
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

// ✏️ PATCH : Modifier un patient
export async function PATCH(request, context) {
  const { error, payload } = verifyJwtAndRole(request, "ADMIN");
  if (error) return error;

  const params = await context.params;
  const id = Number(params.patientId);
  const data = await request.json();

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedPatient);
  } catch (err) {
    console.error("Erreur PATCH patient :", err);
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { error, payload } = verifyJwtAndRole(request, "ADMIN");
  if (error) return error;

  const params = await context.params;
  const id = Number(params.patientId);

  try {
    // Supprimer les entités liées AVANT de supprimer le patient
    await prisma.allergie.deleteMany({ where: { patientId: id } });
    await prisma.rendezVous.deleteMany({ where: { patientId: id } });
    await prisma.dossierMedical.deleteMany({ where: { patientId: id } });

    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Patient supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE patient :", err);
    return NextResponse.json({ message: "Erreur lors de la suppression" }, { status: 500 });
  }
}

