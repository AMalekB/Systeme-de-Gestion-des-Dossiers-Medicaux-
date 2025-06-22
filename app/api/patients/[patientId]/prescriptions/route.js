// app/api/patients/[patientId]/prescriptions/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function POST(request, context) {
  // 1️⃣ Lecture correcte de params (await)
  const { patientId: patientIdStr } = await context.params;
  const patientId = parseInt(patientIdStr, 10);

  // 2️⃣ Authentification + vérification de rôle
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;
  const medecinId = payload.userId || payload.id;

  try {
    // 3️⃣ Lecture du body (description + items)
    const { description, items } = await request.json();

    // 4️⃣ Récupère ou crée automatiquement le dossier médical
    let dossier = await prisma.dossierMedical.findUnique({
      where: { patientId },
    });
    if (!dossier) {
      dossier = await prisma.dossierMedical.create({ data: { patientId } });
    }

    // 5️⃣ Création de la prescription et de ses lignes
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
        items: { include: { medicament: true } },
        medecin: {
          include: {
            utilisateur: { select: { nom: true } },
          },
        },
      },
    });

    // 6️⃣ Journalisation de l'action dans l'historique
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

    // 7️⃣ Renvoie la nouvelle prescription entièrement chargée
    return NextResponse.json(newPrescription, { status: 201 });
  } catch (err) {
    console.error("Erreur POST /prescriptions :", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
