import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req) {
  try {
    const { email, motDePasse } = await req.json();

    if (!email || !motDePasse) {
      return NextResponse.json(
        { message: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });

    if (!utilisateur || utilisateur.role !== 'PATIENT') {
      return NextResponse.json(
        { message: 'Utilisateur non autorisé' },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!match) {
      return NextResponse.json(
        { message: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    console.error('Erreur login patient :', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
