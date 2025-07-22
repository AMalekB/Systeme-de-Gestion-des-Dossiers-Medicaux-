const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Récupérer tous les patients sans utilisateur associé
  const patientsSansUtilisateur = await prisma.patient.findMany({
    where: { utilisateurId: null }, // ✅ conforme à ton schema.prisma
  });

  console.log(`➡️ ${patientsSansUtilisateur.length} patient(s) sans utilisateur.`);

  for (const patient of patientsSansUtilisateur) {
    const email = `${patient.prenom.toLowerCase()}.${patient.nom.toLowerCase()}@demo.com`;

    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      console.log(`⚠️ L'utilisateur ${email} existe déjà. Patient ignoré.`);
      continue;
    }

    // Créer un nouvel utilisateur
    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom: `${patient.prenom} ${patient.nom}`,
        email,
        motDePasse: 'patient123', // 🔐 À hasher plus tard
        role: 'PATIENT',
      },
    });

    // Associer l'utilisateur au patient
    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        utilisateurId: nouvelUtilisateur.id,
      },
    });

    console.log(`✅ Patient ${patient.id} lié à ${email}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
