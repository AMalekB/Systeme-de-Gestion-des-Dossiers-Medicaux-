const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const usersCorriges = await prisma.utilisateur.updateMany({
    where: {
      role: { notIn: ['ADMIN', 'MEDECIN', 'PATIENT'] },
    },
    data: {
      role: 'PATIENT',
    },
  });

  console.log(`✅ Utilisateurs mis à jour : ${usersCorriges.count}`);
}

main()
  .catch((e) => console.error('❌ Erreur :', e))
  .finally(() => prisma.$disconnect());
