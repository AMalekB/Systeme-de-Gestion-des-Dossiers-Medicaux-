// ✅ Route API: GET et POST patients - app/api/patients/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

// 🔍 GET : Récupérer tous les patients
export async function GET() {
  const patients = await prisma.patient.findMany({
    include: {
      dossierMedical: true,
    },
  });
  return NextResponse.json(patients);
}

// ➕ POST : Ajouter un patient et créer son dossier médical vide
export async function POST(req) {
  const { error, payload } = verifyJwtAndRole(req, "ADMIN");
  if (error) return error;

  const data = await req.json();
  const { nom, prenom, dateNaissance, telephone, adresse } = data;

  try {
    const newPatient = await prisma.patient.create({
      data: {
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance + "T12:00:00"),
        telephone,
        adresse,
        dossierMedical: {
          create: {
            historiqueMedical: "",
            notesMedecin: "",
            medecin: { connect: { id: 1 } }, // 👈 fonctionne maintenant
          },
        },
      },
      include: {
        dossierMedical: true,
      },
    });

    return NextResponse.json(newPatient);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur création patient" },
      { status: 500 }
    );
  }}