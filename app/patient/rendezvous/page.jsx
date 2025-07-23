import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

export default async function Page() {
  // ✅ cookies() n’est PAS async ici
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.warn("Pas de token trouvé dans les cookies");
    redirect("/login");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    console.error("JWT invalide :", err);
    redirect("/login");
  }

  if (decoded.role !== "PATIENT") {
    console.warn("Rôle non autorisé :", decoded.role);
    redirect("/login");
  }

  // 🧪 TEST AVEC UN CONTENU FIXE AVANT PRISMA
  // return <div>✅ Token OK pour {decoded.nom}</div>;

  let rendezvous = [];
  try {
    rendezvous = await prisma.rendezVous.findMany({
      where: {
        patient: {
          utilisateurId: decoded.id,
        },
      },
      include: {
        medecin: {
          include: {
            utilisateur: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });
  } catch (err) {
    console.error("Erreur Prisma :", err);
    return (
      <div className="p-6 text-red-600">Erreur de chargement des données</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">
        Mes rendez-vous
      </h1>

      {rendezvous.length === 0 ? (
        <p className="text-gray-600">Aucun rendez-vous prévu.</p>
      ) : (
        <ul className="space-y-4">
          {rendezvous.map((rdv) => (
            <li key={rdv.id} className="border p-4 rounded-lg bg-white shadow">
              <p>
                📅 <strong>{new Date(rdv.date).toLocaleDateString()}</strong> à{" "}
                {rdv.heure}
              </p>
              <p>
                💬 <strong>Type :</strong> {rdv.typeConsultation}
              </p>
              <p>
                👨‍⚕️ <strong>Médecin :</strong>{" "}
                {rdv.medecin?.utilisateur?.nom || "Non attribué"}
              </p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
