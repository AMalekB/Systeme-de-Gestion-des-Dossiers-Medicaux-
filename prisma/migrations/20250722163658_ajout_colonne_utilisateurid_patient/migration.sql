/*
  Warnings:

  - A unique constraint covering the columns `[utilisateurId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PATIENT';

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "utilisateurId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_utilisateurId_key" ON "Patient"("utilisateurId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
