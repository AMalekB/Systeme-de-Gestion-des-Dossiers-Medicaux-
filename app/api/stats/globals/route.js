import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapter si ton client Prisma est ailleurs
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const [patients, medecins, rendezvous, dossiers] = await Promise.all([
    prisma.patient.count(),
    prisma.medecin.count(),
    prisma.rendezVous.count(),
    prisma.dossierMedical.count()
  ]);

  const now = new Date();
  const [rdvToday, rdvWeek, rdvMonth] = await Promise.all([
    prisma.rendezVous.count({
      where: {
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now)
        }
      }
    }),
    prisma.rendezVous.count({
      where: {
        date: {
          gte: startOfWeek(now),
          lte: endOfWeek(now)
        }
      }
    }),
    prisma.rendezVous.count({
      where: {
        date: {
          gte: startOfMonth(now),
          lte: endOfMonth(now)
        }
      }
    })
  ]);

  return NextResponse.json({
    patients,
    medecins,
    rendezvous,
    dossiers,
    "rdv aujourd'hui": rdvToday,
    "rdv semaine": rdvWeek,
    "rdv mois": rdvMonth
  });
}
