const { PrismaClient } = require('@prisma/client');
const faker = require('@faker-js/faker').fakerFR_CA;

const prisma = new PrismaClient();

async function main() {
  // Admin
  const existingAdmin = await prisma.utilisateur.findUnique({
    where: { email: 'admin@example.com' }
  });

  let adminUser;
  if (!existingAdmin) {
    adminUser = await prisma.utilisateur.create({
      data: {
        nom: 'Admin User',
        email: 'admin@example.com',
        motDePasse: 'adminpass',
        role: 'ADMIN',
        administrateur: {
          create: {}
        }
      }
    });
  } else {
    adminUser = existingAdmin;
  }

  // Médecin de test
  const existingMedecin = await prisma.utilisateur.findUnique({
    where: { email: 'martin@example.com' }
  });

  let medecinUser;
  if (!existingMedecin) {
    medecinUser = await prisma.utilisateur.create({
      data: {
        nom: 'Dr. Martin',
        email: 'martin@example.com',
        motDePasse: 'medpass',
        role: 'MEDECIN',
        medecin: {
          create: {
            specialite: 'Cardiologie'
          }
        }
      },
      include: { medecin: true }
    });
  } else {
    medecinUser = await prisma.utilisateur.findUnique({
      where: { email: 'martin@example.com' },
      include: { medecin: true }
    });
  }

  // 20 médecins aléatoires
  for (let i = 0; i < 20; i++) {
    const email = faker.internet.email().toLowerCase();
    const exists = await prisma.utilisateur.findUnique({ where: { email } });

    if (!exists) {
      await prisma.utilisateur.create({
        data: {
          nom: `Dr. ${faker.person.lastName()}`,
          email: email,
          motDePasse: 'medpass',
          role: 'MEDECIN',
          medecin: {
            create: {
              specialite: faker.person.jobType()
            }
          }
        }
      });
    }
  }

  // 100 patients
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(['Ottawa', 'Gatineau']);
    const province = city === 'Ottawa' ? 'ON' : 'QC';
    const adresse = `${faker.location.streetAddress()}, ${city}, ${province}, ${faker.location.zipCode()}`;

    const patient = await prisma.patient.create({
      data: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        dateNaissance: faker.date.birthdate({ min: 1950, max: 2005, mode: 'year' }),
        adresse: adresse,
        telephone: faker.phone.number('(###) ###-####'),
        allergies: {
          create: [
            { nom: faker.word.noun() }
          ]
        }
      }
    });

    // Dossier médical avec champs requis
    await prisma.dossierMedical.create({
      data: {
        historiqueMedical: faker.lorem.sentence(),
        notesMedecin: faker.lorem.sentences(2),
        patientId: patient.id,
        medecinId: medecinUser.medecin.id
      }
    });

    console.log(`👤 Patient ${i + 1}/100 ajouté`);
  }

  console.log('✅ Données générées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
