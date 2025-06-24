// app/api/medecin/rendezvous/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtAndRole } from "@/lib/auth";

export async function GET(request) {
  // 1️⃣ Authentification + rôle
  const { error, payload } = verifyJwtAndRole(request, "MEDECIN");
  if (error) return error;

  // 2️⃣ Récupère l'ID de l'utilisateur depuis le token
  const userId = payload.userId || payload.id;

  // 3️⃣ Charge le profil Médecin lié à cet utilisateur
  const medecin = await prisma.medecin.findUnique({
    where: { utilisateurId: userId },
  });
  if (!medecin) {
    return NextResponse.json(
      { message: "Aucun profil médecin associé à cet utilisateur" },
      { status: 404 }
    );
  }
  const medecinId = medecin.id;

  try {
    // 4️⃣ Récupérer tous les RDV de ce médecin, triés par date croissante
    const mesRendezVous = await prisma.rendezVous.findMany({
      where: { medecinId },
      orderBy: { date: "asc" },
      include: {
        patient: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });

    return NextResponse.json(mesRendezVous);
  } catch (err) {
    console.error("Erreur GET /medecin/rendezvous :", err);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des rendez-vous" },
      { status: 500 }
    );
  }
}
