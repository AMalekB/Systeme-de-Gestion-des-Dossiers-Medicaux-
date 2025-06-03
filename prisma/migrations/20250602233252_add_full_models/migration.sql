-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Allergie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "Allergie_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medecin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "specialite" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    CONSTRAINT "Medecin_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL,
    CONSTRAINT "Administrateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DossierMedical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historique" TEXT NOT NULL,
    "notesMedic" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DossierMedical_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "dossierId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    CONSTRAINT "Prescription_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "DossierMedical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medicament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "duree" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "heure" TEXT NOT NULL,
    "typeConsultation" TEXT NOT NULL,
    "rappel" BOOLEAN NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RendezVous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PrescriptionMedicament" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PrescriptionMedicament_A_fkey" FOREIGN KEY ("A") REFERENCES "Medicament" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PrescriptionMedicament_B_fkey" FOREIGN KEY ("B") REFERENCES "Prescription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_utilisateurId_key" ON "Medecin"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrateur_utilisateurId_key" ON "Administrateur"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "_PrescriptionMedicament_AB_unique" ON "_PrescriptionMedicament"("A", "B");

-- CreateIndex
CREATE INDEX "_PrescriptionMedicament_B_index" ON "_PrescriptionMedicament"("B");
