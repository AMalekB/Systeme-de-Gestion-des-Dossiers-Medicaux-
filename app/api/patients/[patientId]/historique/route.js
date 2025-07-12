import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔐 Fonction utilitaire pour identifier le médecin via le token
async function getMedecinConnecte(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  console.log("✅ payload JWT décodé :", payload);

  const medecin = await prisma.medecin.findUnique({
    where: { utilisateurId: payload.id }, // ← Assure-toi que payload.id est bien l'utilisateur
  });

  return medecin;
}

export async function POST(req, { params }) {
  const medecin = await getMedecinConnecte(req);
  if (!medecin) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const patientId = parseInt(params.patientId); // ← Attention ici, c’est bien `patientId`
  const { contenu } = await req.json();

  const dossier = await prisma.dossierMedical.findFirst({
    where: { patientId },
  });

  if (!dossier) {
    return NextResponse.json({ message: "Dossier non trouvé" }, { status: 404 });
  }

  // ✅ 1. Ajouter le contenu dans le champ `historiqueMedical`
  await prisma.dossierMedical.update({
    where: { id: dossier.id },
    data: {
      historiqueMedical: {
        set: `${dossier.historiqueMedical || ""}\n\n📝 ${new Date().toLocaleDateString()} - ${contenu}`,
      },
    },
  });

  // ✅ 2. Ajouter un message d’action générique dans l’historique
  await prisma.historique.create({
    data: {
      contenu: "Nouvelle note enregistrée",
      type: "Action",
      date: new Date(),
      medecin: { connect: { id: medecin.id } },
      dossier: { connect: { id: dossier.id } },
    },
  });

  return NextResponse.json({ success: true });
}
