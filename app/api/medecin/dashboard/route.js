import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwtAndRole } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET(req) {
  const { error, payload } = verifyJwtAndRole(req, "MEDECIN");
  if (error) return error;

  try {
    // 🔍 On récupère l'utilisateur (le médecin) via son ID
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        nom: true,
        email: true,
        medecin: true,
      },
    });

    return NextResponse.json({
      message: "MEDECIN authentifié",
      user: utilisateur,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
