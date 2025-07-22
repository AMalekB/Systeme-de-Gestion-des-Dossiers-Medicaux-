import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersecret';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nom,
      prenom,
      email,
      motDePasse,
      dateNaissance,
      adresse,
      telephone,
    } = body;

    if (!nom || !prenom || !email || !motDePasse) {
      return NextResponse.json(
        { message: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: 'Email déjà utilisé' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom: `${prenom} ${nom}`,
        email,
        motDePasse: hashedPassword,
        role: 'PATIENT',
      },
    });

    await prisma.patient.create({
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance),
        adresse,
        telephone,
        utilisateurId: utilisateur.id,
      },
    });

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Inscription réussie',
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    console.error('Erreur inscription patient :', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
