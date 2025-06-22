// app/api/patients/[patientId]/prescriptions/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function POST(request, context) {
  // 1️⃣ Lecture du patientId depuis les params dynamiques
  const params = await context.params;
  const patientId = parseInt(params.patientId, 10);

  // 2️⃣ Authentification + identification du Médecin via Utilisateur.id
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  const utilisateurId = payload.userId || payload.id;
  let medecinRecord = await prisma.medecin.findUnique({
    where: { utilisateurId },
  });
  if (!medecinRecord) {
    medecinRecord = await prisma.medecin.create({
      data: {
        utilisateurId,
        specialite: "Médecine Générale",
      },
    });
  }
  const medecinId = medecinRecord.id;

  // DEBUG pour vérifier
  console.log(
    "[POST /prescriptions] utilisateurId, medecinId, medecinRecord =>",
    { utilisateurId, medecinId, medecinRecord }
  );

  try {
    // 3️⃣ Lecture du body (description + items de prescription)
    const { description, items } = await request.json();

    // 4️⃣ Récupérer ou créer le DossierMedical
    let dossier = await prisma.dossierMedical.findUnique({
      where: { patientId },
    });
    if (!dossier) {
      dossier = await prisma.dossierMedical.create({
        data: { patientId },
      });
    }

    // 5️⃣ Création de la Prescription et de ses Lignes (PrescriptionMedicament)
    const newPrescription = await prisma.prescription.create({
      data: {
        description,
        dossierId: dossier.id,
        medecinId,
        items: {
          create: items.map((i) => ({
            medicamentId: Number(i.medicamentId),
            dosage: i.dosage,
            frequence: i.frequence,
            duree: i.duree,
            instructions: i.instructions,
          })),
        },
      },
      include: {
        medecin: {
          include: {
            utilisateur: { select: { nom: true } },
          },
        },
        items: { include: { medicament: true } },
      },
    });

    // 6️⃣ Ajout d'une entrée dans l'Historique
    await prisma.historique.create({
      data: {
        dossierId: dossier.id,
        medecinId,
        type: "prescription",
        contenu:
          `Ajout de ${items.length} médicament(s)` +
          (description ? ` • Note : ${description}` : ""),
      },
    });

    // 7️⃣ Retour de la nouvelle Prescription
    return NextResponse.json(newPrescription, { status: 201 });
  } catch (err) {
    console.error("Erreur POST /prescriptions :", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
