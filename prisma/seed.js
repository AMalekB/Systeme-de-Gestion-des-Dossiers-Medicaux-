const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/fr_CA");

const prisma = new PrismaClient();

async function main() {
  // Création de l'administrateur principal
  const existingAdmin = await prisma.utilisateur.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    await prisma.utilisateur.create({
      data: {
        nom: "Admin User",
        email: "admin@example.com",
        motDePasse: "adminpass",
        role: "ADMIN",
        administrateur: { create: {} },
      },
    });
    console.log("👤 Administrateur créé");
  } else {
    console.log("👤 Administrateur existant trouvé");
  }

  // Création d'un médecin de test
  const existingMedecin = await prisma.utilisateur.findUnique({
    where: { email: "martin@example.com" },
  });

  let medecinUser;
  if (!existingMedecin) {
    medecinUser = await prisma.utilisateur.create({
      data: {
        nom: "Dr. Martin",
        email: "martin@example.com",
        motDePasse: "medpass",
        role: "MEDECIN",
        medecin: {
          create: { specialite: "Cardiologie" },
        },
      },
      include: { medecin: true },
    });
    console.log("👨‍⚕️ Médecin de test créé");
  } else {
    medecinUser = await prisma.utilisateur.findUnique({
      where: { email: "martin@example.com" },
      include: { medecin: true },
    });
    console.log("👨‍⚕️ Médecin de test existant trouvé");
  }

  // Création de 20 médecins aléatoires
  for (let i = 0; i < 20; i++) {
    const email = faker.internet.email().toLowerCase();
    const exists = await prisma.utilisateur.findUnique({ where: { email } });
    if (!exists) {
      await prisma.utilisateur.create({
        data: {
          nom: `Dr. ${faker.name.lastName()}`,
          email,
          motDePasse: "medpass",
          role: "MEDECIN",
          medecin: { create: { specialite: faker.name.jobType() } },
        },
      });
      console.log(`👨‍⚕️ Médecin aléatoire ${i + 1} créé`);
    }
  }

  // Création de 100 patients avec dossier médical
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(["Ottawa", "Gatineau"]);
    const province = city === "Ottawa" ? "ON" : "QC";
    const adresse = `${faker.address.streetAddress()}, ${city}, ${province}, ${faker.address.zipCode()}`;

    const patient = await prisma.patient.create({
      data: {
        nom: faker.name.lastName(),
        prenom: faker.name.firstName(),
        dateNaissance: faker.date.birthdate({
          min: 1950,
          max: 2005,
          mode: "year",
        }),
        adresse,
        telephone: faker.phone.number("(###) ###-####"),
        allergies: { create: [{ nom: faker.word.noun() }] },
      },
    });

    await prisma.dossierMedical.create({
      data: {
        historiqueMedical: faker.lorem.sentence(),
        notesMedecin: faker.lorem.sentences(2),
        patient: { connect: { id: patient.id } },
      },
    });

    console.log(`👤 Patient ${i + 1}/100 ajouté avec son dossier médical`);
  }

  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
