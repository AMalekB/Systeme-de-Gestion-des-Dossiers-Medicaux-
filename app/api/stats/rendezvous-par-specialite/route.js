import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = req.nextUrl;
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json({ error: "Dates manquantes" }, { status: 400 });
    }

    const start = new Date(from);
    const end = new Date(to);

    const rdvs = await prisma.rendezVous.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        medecin: true,
      },
    });

    // Regrouper les rendez-vous par spécialité
    const repartition = {};

    for (const rdv of rdvs) {
      const specialite = rdv.medecin?.specialite || "Inconnue";
      repartition[specialite] = (repartition[specialite] || 0) + 1;
    }

    const result = Object.entries(repartition).map(([specialite, count]) => ({
      specialite,
      count,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Erreur API spécialités:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
