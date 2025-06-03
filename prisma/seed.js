const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Création d'utilisateurs
  const adminUser = await prisma.utilisateur.create({
    data: {
      nom: 'Admin User',
      email: 'admin@example.com',
      motDePasse: 'adminpass', // En prod, hacher le mdp
      role: 'ADMIN',
      administrateur: {
        create: {}
      }
    }
  });

  const medecinUser = await prisma.utilisateur.create({
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
    }
  });

  // Création de patients
  const patient1 = await prisma.patient.create({
    data: {
      nom: 'Dupont',
      prenom: 'Jean',
      dateNaissance: new Date('1980-01-15'),
      adresse: '123 Rue Principale',
      telephone: '0612345678',
      allergies: {
        create: [
          { nom: 'Pollen' },
          { nom: 'Penicilline' }
        ]
      }
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      nom: 'Martin',
      prenom: 'Claire',
      dateNaissance: new Date('1990-07-20'),
      adresse: '456 Avenue des Champs',
      telephone: '0698765432'
    }
  });

  // Création d'un dossier médical lié au patient1 et médecin
  const dossier1 = await prisma.dossierMedical.create({
    data: {
      historique: "Patient avec antécédents d'hypertension.",
      notesMedic: 'Suivi régulier conseillé.',
      patientId: patient1.id,
      medecinId: medecinUser.medecin.id,
    }
  });

  // Création de médicaments
  const med1 = await prisma.medicament.create({
    data: {
      nom: 'Aspirine',
      dosage: '100 mg',
      duree: '10 jours',
    }
  });

  const med2 = await prisma.medicament.create({
    data: {
      nom: 'Ibuprofène',
      dosage: '200 mg',
      duree: '5 jours',
    }
  });

  // Création d'une prescription liée au dossier et médecin, avec médicaments
  const prescription1 = await prisma.prescription.create({
    data: {
      date: new Date(),
      dossierId: dossier1.id,
      medecinId: medecinUser.medecin.id,
      medicaments: {
        connect: [{ id: med1.id }, { id: med2.id }]
      }
    }
  });

  // Création d'un rendez-vous
  const rdv1 = await prisma.rendezVous.create({
    data: {
      date: new Date('2025-06-15'),
      heure: '14:30',
      typeConsultation: 'Consultation générale',
      rappel: true,
      patientId: patient1.id,
      medecinId: medecinUser.medecin.id,
    }
  });

  console.log('Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
