import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { verifyJwtAndRole } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * Points clés pour TON schéma:
 * - Utilisateur: { id, nom, email(unique), motDePasse(hash), role }
 * - Patient: { nom, prenom, dateNaissance(Date), adresse, telephone, utilisateurId(unique) }
 *   => On garde nom/prenom aussi dans Patient (cohérence avec ton schema).
 * - dateNaissance est NON NULL => côté API on exige une date valide.
 * - Mot de passe hashé dans Utilisateur.motDePasse
 */

const updateSchema = z.object({
  // Champs profil (tous requis côté server car Patient.* sont NOT NULL)
  nom: z.string().min(1).max(100),
  prenom: z.string().min(1).max(100),
  email: z.string().email(),
  telephone: z.string().min(1).max(30),
  adresse: z.string().min(1).max(255),
  // On accepte "YYYY-MM-DD" ou ISO; on convertit en Date
  dateNaissance: z.string().min(4),

  // Mot de passe (optionnel, mais si on en fournit un → règles ci-dessous)
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(8).optional(),
  newPasswordConfirm: z.string().min(8).optional(),
}).refine((data) => {
  const wantsPwd = !!(data.currentPassword || data.newPassword || data.newPasswordConfirm);
  if (!wantsPwd) return true;
  return !!(
    data.currentPassword &&
    data.newPassword &&
    data.newPasswordConfirm &&
    data.newPassword === data.newPasswordConfirm
  );
}, {
  message: "Pour changer le mot de passe, fournissez l'ancien, le nouveau et la confirmation identique.",
  path: ["newPasswordConfirm"],
});

function toDateOrThrow(s) {
  // Support "YYYY-MM-DD" ou ISO
  const str = String(s || "").trim();
  const d = str.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(str)
    ? new Date(`${str}T00:00:00.000Z`)
    : new Date(str);
  if (isNaN(d.getTime())) throw new Error("dateNaissance invalide");
  return d;
}

export async function GET(req) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const patient = await prisma.patient.findFirst({
    where: { utilisateurId: payload.id },
    include: { utilisateur: { select: { nom: true, email: true } } },
  });

  if (!patient) {
    return NextResponse.json({ message: "Profil introuvable" }, { status: 404 });
  }

  // Remonte les infos consolidées (nom: on renvoie celui du patient pour l'UI)
  return NextResponse.json({
    nom: patient.nom ?? patient.utilisateur?.nom ?? "",
    prenom: patient.prenom ?? "",
    email: patient.utilisateur?.email ?? "",
    telephone: patient.telephone ?? "",
    adresse: patient.adresse ?? "",
    dateNaissance: patient.dateNaissance ? patient.dateNaissance.toISOString() : "",
  });
}

export async function PUT(req) {
  const { error, payload } = verifyJwtAndRole(req, "PATIENT");
  if (error) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    nom, prenom, email, telephone, adresse, dateNaissance,
    currentPassword, newPassword, newPasswordConfirm,
  } = parsed.data;

  const patient = await prisma.patient.findFirst({
    where: { utilisateurId: payload.id },
    include: { utilisateur: true },
  });

  if (!patient) {
    return NextResponse.json({ message: "Profil introuvable" }, { status: 404 });
  }

  try {
    let passwordChanged = false;
    const dateObj = toDateOrThrow(dateNaissance);

    const updated = await prisma.$transaction(async (tx) => {
      // 🔐 changement de mot de passe (optionnel)
      if (currentPassword || newPassword || newPasswordConfirm) {
        const user = await tx.utilisateur.findUnique({ where: { id: patient.utilisateurId } });
        if (!user) {
          throw Object.assign(new Error("Utilisateur introuvable"), { status: 404 });
        }
        const ok = await bcrypt.compare(currentPassword, user.motDePasse);
        if (!ok) {
          throw Object.assign(new Error("Mot de passe actuel incorrect"), { status: 401 });
        }
        const newHash = await bcrypt.hash(newPassword, 10);
        await tx.utilisateur.update({
          where: { id: user.id },
          data: { motDePasse: newHash },
        });
        passwordChanged = true;
      }

      // 🧭 mise à jour Patient (tous NOT NULL dans ton schema)
      const updatedPatient = await tx.patient.update({
        where: { id: patient.id },
        data: {
          nom,
          prenom,
          telephone,
          adresse,
          dateNaissance: dateObj,
        },
        include: { utilisateur: true },
      });

      // ✉️ mise à jour Utilisateur (email + nom pour rester cohérent)
      const updateUserData = {};
      if (email && email !== patient.utilisateur.email) {
        updateUserData.email = email;
      }
      // on synchronise aussi le nom utilisateur avec le nom patient (si tu préfères le contraire, dis-moi)
      if (nom && nom !== patient.utilisateur.nom) {
        updateUserData.nom = nom;
      }
      if (Object.keys(updateUserData).length > 0) {
        await tx.utilisateur.update({
          where: { id: patient.utilisateurId },
          data: updateUserData,
        });
      }

      return updatedPatient;
    });

    return NextResponse.json({
      nom: updated.nom,
      prenom: updated.prenom,
      email: email || patient.utilisateur.email,
      telephone: updated.telephone,
      adresse: updated.adresse,
      dateNaissance: updated.dateNaissance.toISOString(),
      passwordChanged,
    });
  } catch (e) {
    if (e?.status) {
      return NextResponse.json({ message: e.message }, { status: e.status });
    }
    if (e?.code === "P2002") {
      return NextResponse.json({ message: "Cet email est déjà utilisé." }, { status: 409 });
    }
    if (e?.message === "dateNaissance invalide") {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
