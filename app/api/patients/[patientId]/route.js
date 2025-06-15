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
// 📝 PUT : Modifier un patient
export async function PUT(req, { params }) {
  const id = params.patientId;
  const data = await req.json();

 

  const { nom, prenom, dateNaissance, telephone, adresse } = data;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: Number(id) },
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
    console.error("Erreur PUT patient :", error.message, error.stack);
    return NextResponse.json(
      { message: "Erreur modification patient", details: error.message },
      { status: 500 }
    );
  }
}



// ❌ DELETE : Supprimer un patient (et son dossier médical lié)
// ❌ DELETE : Supprimer un patient (et son dossier médical lié)
export async function DELETE(req, context) {
  const params = await context.params;
  const id = Number(params.patientId);

  console.log("ID reçu pour suppression :", id);

  try {
    // Supprimer les prescriptions liées au dossier médical
    await prisma.prescription.deleteMany({
      where: {
        dossier: {
          patientId: id,
        },
      },
    });

    // Supprimer le dossier médical
    await prisma.dossierMedical.deleteMany({
      where: { patientId: id },
    });

    // Supprimer les rendez-vous
    await prisma.rendezVous.deleteMany({
      where: { patientId: id },
    });

    // Supprimer les allergies
    await prisma.allergie.deleteMany({
      where: { patientId: id },
    });

    // Enfin, supprimer le patient
    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Patient supprimé" });
  } catch (error) {
    console.error("Erreur DELETE patient :", error.message, error.stack);
    return NextResponse.json(
      { message: "Erreur suppression patient", details: error.message },
      { status: 500 }
    );
  }
}
