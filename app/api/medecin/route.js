import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const medecins = await prisma.utilisateur.findMany({
      where: { role: "MEDECIN" },
      select: { id: true, nom: true, email: true },
    });
    return NextResponse.json(medecins);
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
