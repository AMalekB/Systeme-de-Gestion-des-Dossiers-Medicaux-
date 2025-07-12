"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function DashboardMedecin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [patients, setPatients] = useState([]);
  const [date, setDate] = useState(new Date());
  const [medecinNom, setMedecinNom] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Non autorisé");
        return res.json();
      })
      .then((data) => {
        setAutorise(true);
        setMedecinNom(data.user.nom);
        return fetch("/api/patients");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les patients");
        return res.json();
      })
      .then((data) => setPatients(data))
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!autorise) return null;

  return (
    <LayoutDashboard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-5xl text-black font-bold">Bienvenue {medecinNom}</h2>
      </div>

      <p className="mb-6 text-black">
        Ici, vous pouvez consulter vos patients, gérer les dossiers médicaux et les rendez-vous.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">

        {/* Nouveauté de la clinique */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Nouveauté de la clinique</h3>
          <p className="text-gray-600 text-sm">
            - Nouveau service de téléconsultation disponible dès maintenant.<br />
            - Mise à jour des horaires d'ouverture pour la saison estivale.<br />
            - Campagne de vaccination contre la grippe en cours.<br />
            - Recrutement de nouveaux spécialistes en pédiatrie.<br />
            - Nouvelle plateforme de suivi des résultats de laboratoire.<br />
            - Ajout d’un module de formation continue pour les médecins.<br />
            - Amélioration de l’accès aux dossiers médicaux à distance.<br />
            - Rénovation des salles de consultation terminée.
          </p>
        </div>

        {/* Liens utiles */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-y-auto max-h-[300px]">
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Liens utiles</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li><a href="https://www.rxivigilance.org/" target="_blank" className="text-blue-600 hover:underline">RxVigilance</a></li>
            <li><a href="https://www.canada.ca/fr/sante-publique.html" target="_blank" className="text-blue-600 hover:underline">Santé publique Canada</a></li>
            <li><a href="https://www.cps.ca/" target="_blank" className="text-blue-600 hover:underline">Société canadienne de pédiatrie</a></li>
            <li><a href="https://www.cma.ca/" target="_blank" className="text-blue-600 hover:underline">Association médicale canadienne</a></li>
            <li><a href="https://www.who.int/" target="_blank" className="text-blue-600 hover:underline">Organisation mondiale de la santé</a></li>
            <li><a href="https://www.uptodate.com/" target="_blank" className="text-blue-600 hover:underline">UpToDate</a></li>
            <li><a href="https://www.msdmanuals.com/fr" target="_blank" className="text-blue-600 hover:underline">Manuel MSD</a></li>
          </ul>
        </div>

        {/* Derniers articles médicaux */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Derniers articles médicaux</h3>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>
              <a
                href="https://ca.beyondtype2.org/fr/le-jeune-intermittent-et-le-diabete-de-type-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Impact du jeûne intermittent sur le diabète de type 2
              </a>
            </li>
            <li>
              <a
                href="https://eczemahelp.ca/fr/mise-a-jour-de-nouveaux-traitements-contre-la-da-sont-accessibles-et-dautres-arrivent-bientot-sur-le-marche/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Mise à jour sur les traitements de l’eczéma sévère
              </a>
            </li>
            <li>
              <a
                href="https://www.hug.ch/sites/interhug/files/2025-03/hug-postcovid-fr-a4-final_prod_0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Recommandations pour le suivi post-COVID
              </a>
            </li>
            <li>
              <a
                href="https://www.who.int/fr/news-room/questions-and-answers/item/coronavirus-disease-(covid-19)-vaccines-safety"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Vaccins ARNm : effets secondaires à long terme
              </a>
            </li>
          </ul>
        </div>

        {/* Tableau de vaccination - col-span 2 */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 col-span-1 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Tableau de vaccination au Canada</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Âge</th>
                  <th className="border px-4 py-2 text-left">Vaccins</th>
                  <th className="border px-4 py-2 text-left">Maladies prévenues</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-4 py-2">2 mois</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, Hib, Hépatite B, Rotavirus, Pneumocoque</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, infections à Hib, hépatite B, rotavirus, infections pneumococciques</td></tr>
                <tr><td className="border px-4 py-2">4 mois</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, Hib, Hépatite B, Rotavirus, Pneumocoque</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, infections à Hib, hépatite B, rotavirus, infections pneumococciques</td></tr>
                <tr><td className="border px-4 py-2">6 mois</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, Hib, Hépatite B (certains calendriers)</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, infections à Hib, hépatite B</td></tr>
                <tr><td className="border px-4 py-2">12 mois</td><td className="border px-4 py-2">Rougeole, rubéole, oreillons, varicelle, Pneumocoque</td><td className="border px-4 py-2">Rougeole, rubéole, oreillons, varicelle, infections pneumococciques</td></tr>
                <tr><td className="border px-4 py-2">18 mois</td><td className="border px-4 py-2">Hépatite A et B, Méningocoque C</td><td className="border px-4 py-2">Hépatite A, hépatite B, infections méningococciques</td></tr>
                <tr><td className="border px-4 py-2">4–6 ans</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, Varicelle</td><td className="border px-4 py-2">Diphtérie, coqueluche, tétanos, poliomyélite, varicelle</td></tr>
                <tr><td className="border px-4 py-2">4e année (primaire)</td><td className="border px-4 py-2">Hépatite A, VPH</td><td className="border px-4 py-2">Hépatite A, infections par les virus du papillome humain</td></tr>
                <tr><td className="border px-4 py-2">Primaire/Secondaire</td><td className="border px-4 py-2">DT, Méningocoque, VPH (certains programmes)</td><td className="border px-4 py-2">Diphtérie, tétanos, méningocoque, VPH</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Calendrier en bas à droite */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg text-black w-[300px]">
        <Calendar
          onChange={setDate}
          value={date}
          className="text-sm rounded"
        />
      </div>
    </LayoutDashboard>
  );
}
