import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "L'email et le mot de passe sont requis." },
      { status: 400 }
    );
  }

  const user = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Email ou mot de passe invalide" },
      { status: 401 }
    );
  }

  let isPasswordValid = false;

  if (user.role === "PATIENT") {
    // 🔐 patient = mot de passe hashé
    isPasswordValid = await bcrypt.compare(password, user.motDePasse);
  } else {
    // 👨‍⚕️ médecin et admin = mot de passe en clair (temporairement)
    isPasswordValid = password === user.motDePasse;
  }

  if (!isPasswordValid) {
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
    role: user.role,
    nom: user.nom,
  });
}
