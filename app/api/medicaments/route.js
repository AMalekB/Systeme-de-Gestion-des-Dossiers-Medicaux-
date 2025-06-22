// app/api/medicaments/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const search = req.nextUrl.searchParams.get("search") || "";
  // Ne rien renvoyer si moins de deux caractères
  if (search.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  // Recherche directe dans la base locale (SQLite LIKE est insensible à la casse ASCII)
  const meds = await prisma.medicament.findMany({
    where: {
      nom: { contains: search },
    },
    take: 20,
  });

  // Formate la réponse pour la datalist
  const result = meds.map((m) => ({ id: m.id, nom: m.nom }));
  return NextResponse.json(result, { status: 200 });
}
