import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.rendezVous.findMany({
    include: {
      medecin: true,
    },
  });

  // Grouper par spécialité
  const repartition = {};

  for (const rdv of data) {
    const specialite = rdv.medecin?.specialite || "Inconnue";
    repartition[specialite] = (repartition[specialite] || 0) + 1;
  }

  // Transformer en tableau
  const result = Object.entries(repartition).map(([specialite, count]) => ({
    specialite,
    count,
  }));

  return NextResponse.json(result);
}
