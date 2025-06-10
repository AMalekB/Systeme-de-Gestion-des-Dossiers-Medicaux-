-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RendezVous" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "heure" TEXT NOT NULL,
    "typeConsultation" TEXT NOT NULL,
    "rappel" BOOLEAN NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medecinId" INTEGER NOT NULL,
    CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RendezVous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RendezVous" ("date", "heure", "id", "medecinId", "patientId", "rappel", "typeConsultation") SELECT "date", "heure", "id", "medecinId", "patientId", "rappel", "typeConsultation" FROM "RendezVous";
DROP TABLE "RendezVous";
ALTER TABLE "new_RendezVous" RENAME TO "RendezVous";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
