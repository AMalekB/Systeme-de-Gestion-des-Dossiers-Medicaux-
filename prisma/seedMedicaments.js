// prisma/seedMedicaments.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const BATCH_SIZE = 500;

async function main() {
  const filePath = path.join(__dirname, "data", "drug.txt");
  if (!fs.existsSync(filePath)) {
    console.error("❌ Fichier drug.txt introuvable dans prisma/data");
    process.exit(1);
  }

  // 1) Lecture du fichier et accumulation
  const meds = [];
  await new Promise((resolve, reject) => {
    let isFirst = true;
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false, separator: "," }))
      .on("data", (row) => {
        if (isFirst) {
          isFirst = false;
          return;
        }
        const din = row[3]?.replace(/"/g, "");
        const nom = row[4]?.replace(/"/g, "");
        if (din && nom) meds.push({ id: Number(din), nom: nom.trim() });
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });

  if (meds.length === 0) {
    console.log("ℹ️ Aucune ligne lue dans drug.txt");
    return;
  }

  // 2) Déduplication par DIN
  const uniqueMeds = Array.from(new Map(meds.map((m) => [m.id, m])).values());
  console.log(`📥 ${uniqueMeds.length} médicaments uniques prêts à seed`);

  // 3) Insertion par lots (sans skipDuplicates)
  for (let i = 0; i < uniqueMeds.length; i += BATCH_SIZE) {
    const batch = uniqueMeds.slice(i, i + BATCH_SIZE);
    await prisma.medicament.createMany({
      data: batch,
    });
    console.log(`  ► Seed ${i + 1} à ${i + batch.length}`);
  }

  console.log("✅ Seed DPD complet terminé");
}

main()
  .catch((e) => {
    console.error("❌ Erreur dans seedMedicaments.js:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
