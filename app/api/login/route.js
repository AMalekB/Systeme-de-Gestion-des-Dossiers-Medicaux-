import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  const { email, password } = await req.json();

  // Validation des champs requis
  if (!email || !password) {
    return NextResponse.json(
      { message: "L'email et le mot de passe sont requis." },
      { status: 400 }
    );
  }

  // Validation du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Format d'email invalide." },
      { status: 400 }
    );
  }

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
