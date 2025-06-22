/*
  Warnings:

  - You are about to drop the `_PrescriptionMedicament` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dosage` on the `Medicament` table. All the data in the column will be lost.
  - You are about to drop the column `duree` on the `Medicament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_PrescriptionMedicament_B_index";

-- DropIndex
DROP INDEX "_PrescriptionMedicament_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PrescriptionMedicament";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PrescriptionMedicament" (
    "prescriptionId" INTEGER NOT NULL,
    "medicamentId" INTEGER NOT NULL,
    "dosage" TEXT,
    "frequence" TEXT,
    "duree" TEXT,
    "instructions" TEXT,

    PRIMARY KEY ("prescriptionId", "medicamentId"),
    CONSTRAINT "PrescriptionMedicament_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrescriptionMedicament_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Historique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dossierId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    CONSTRAINT "Historique_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "DossierMedical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Historique_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medicament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);
INSERT INTO "new_Medicament" ("id", "nom") SELECT "id", "nom" FROM "Medicament";
DROP TABLE "Medicament";
ALTER TABLE "new_Medicament" RENAME TO "Medicament";
CREATE TABLE "new_Prescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "dossierId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    CONSTRAINT "Prescription_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "DossierMedical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prescription_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prescription" ("date", "description", "dossierId", "id", "medecinId") SELECT "date", "description", "dossierId", "id", "medecinId" FROM "Prescription";
DROP TABLE "Prescription";
ALTER TABLE "new_Prescription" RENAME TO "Prescription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
