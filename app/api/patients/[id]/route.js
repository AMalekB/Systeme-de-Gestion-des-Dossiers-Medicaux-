// app/api/patients/[id]/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

// 🔍 GET : Récupérer un patient par ID (avec son dossier médical et plus)
export async function GET(request, { params }) {
  // Vérification du rôle MEDECIN
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  const id = Number(params.id);
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        dossierMedical: true,
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
    console.error("Erreur GET patient par ID :", err);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération du patient" },
      { status: 500 }
    );
  }
}

// 📝 PUT : Modifier un patient
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();
  const { nom, prenom, dateNaissance, telephone, adresse } = data;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: Number(id) },
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance + "T12:00:00"),
        telephone,
        adresse,
      },
    });
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Erreur PUT patient :", error);
    return NextResponse.json(
      { message: "Erreur modification patient" },
      { status: 500 }
    );
  }
}

// ❌ DELETE : Supprimer un patient (et son dossier médical lié)
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    await prisma.dossierMedical.deleteMany({
      where: { patientId: Number(id) },
    });
    await prisma.patient.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Patient supprimé" });
  } catch (error) {
    console.error("Erreur DELETE patient :", error);
    return NextResponse.json(
      { message: "Erreur suppression patient" },
      { status: 500 }
    );
  }
}
