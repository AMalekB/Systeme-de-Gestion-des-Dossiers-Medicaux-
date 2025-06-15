-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DossierMedical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historiqueMedical" TEXT,
    "notesMedecin" TEXT,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DossierMedical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DossierMedical_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DossierMedical" ("createdAt", "historiqueMedical", "id", "medecinId", "notesMedecin", "patientId", "updatedAt") SELECT "createdAt", "historiqueMedical", "id", "medecinId", "notesMedecin", "patientId", "updatedAt" FROM "DossierMedical";
DROP TABLE "DossierMedical";
ALTER TABLE "new_DossierMedical" RENAME TO "DossierMedical";
CREATE UNIQUE INDEX "DossierMedical_patientId_key" ON "DossierMedical"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
