/*
  Warnings:

  - You are about to drop the column `historique` on the `DossierMedical` table. All the data in the column will be lost.
  - You are about to drop the column `notesMedic` on the `DossierMedical` table. All the data in the column will be lost.
  - Added the required column `historiqueMedical` to the `DossierMedical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notesMedecin` to the `DossierMedical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DossierMedical` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DossierMedical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historiqueMedical" TEXT NOT NULL,
    "notesMedecin" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DossierMedical_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DossierMedical" ("id", "medecinId", "patientId") SELECT "id", "medecinId", "patientId" FROM "DossierMedical";
DROP TABLE "DossierMedical";
ALTER TABLE "new_DossierMedical" RENAME TO "DossierMedical";
CREATE UNIQUE INDEX "DossierMedical_patientId_key" ON "DossierMedical"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
