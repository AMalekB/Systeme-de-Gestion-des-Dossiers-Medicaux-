-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEDECIN');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Allergie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medecin" (
    "id" SERIAL NOT NULL,
    "specialite" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "Medecin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrateur" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "Administrateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DossierMedical" (
    "id" SERIAL NOT NULL,
    "historiqueMedical" TEXT,
    "notesMedecin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER,

    CONSTRAINT "DossierMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "dossierId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicament" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Medicament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionMedicament" (
    "prescriptionId" INTEGER NOT NULL,
    "medicamentId" INTEGER NOT NULL,
    "dosage" TEXT,
    "frequence" TEXT,
    "duree" TEXT,
    "instructions" TEXT,

    CONSTRAINT "PrescriptionMedicament_pkey" PRIMARY KEY ("prescriptionId","medicamentId")
);

-- CreateTable
CREATE TABLE "Historique" (
    "id" SERIAL NOT NULL,
    "dossierId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,

    CONSTRAINT "Historique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TEXT NOT NULL,
    "typeConsultation" TEXT NOT NULL,
    "rappel" BOOLEAN NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_utilisateurId_key" ON "Medecin"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrateur_utilisateurId_key" ON "Administrateur"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "DossierMedical_patientId_key" ON "DossierMedical"("patientId");

-- AddForeignKey
ALTER TABLE "Allergie" ADD CONSTRAINT "Allergie_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medecin" ADD CONSTRAINT "Medecin_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrateur" ADD CONSTRAINT "Administrateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierMedical" ADD CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierMedical" ADD CONSTRAINT "DossierMedical_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "DossierMedical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedicament" ADD CONSTRAINT "PrescriptionMedicament_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionMedicament" ADD CONSTRAINT "PrescriptionMedicament_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historique" ADD CONSTRAINT "Historique_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "DossierMedical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historique" ADD CONSTRAINT "Historique_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
