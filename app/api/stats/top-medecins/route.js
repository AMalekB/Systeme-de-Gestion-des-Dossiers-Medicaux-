import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = req.nextUrl;
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json({ error: "Missing dates" }, { status: 400 });
    }

    const start = new Date(from);
    const end = new Date(to);

    if (isNaN(start) || isNaN(end)) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    const rdvs = await prisma.rendezVous.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        medecin: {
          include: {
            utilisateur: true,
          },
        },
      },
    });

    const compteur = {};
    for (const rdv of rdvs) {
      const nom = rdv.medecin?.utilisateur?.nom || "Inconnu";
      compteur[nom] = (compteur[nom] || 0) + 1;
    }

    const top = Object.entries(compteur)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, count]) => ({ nom, count }));

    return NextResponse.json(top);
  } catch (err) {
    console.error("Erreur API top-medecins:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
