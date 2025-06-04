import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!user || user.motDePasse !== password) {
    return NextResponse.json(
      { message: "Email ou mot de passe invalide" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: "1h",
  });

  return NextResponse.json({
    token,
    role: user.role, // 👈 important pour la redirection
    nom: user.nom,
  });
}
