"use client"
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";

/**
 * Page d'accueil du système de gestion des dossiers médicaux
 * Cette page présente les principales fonctionnalités et avantages du système
 */
export default function Home() {
  // Animation count up pour les chiffres clés
  const secuRef = useRef();
  const supportRef = useRef();
  const usersRef = useRef();
  useEffect(() => {
    const animateCount = (ref, end, duration = 1200) => {
      if (!ref.current) return;
      let start = 0;
      const step = Math.ceil(end / (duration / 16));
      const update = () => {
        start += step;
        if (start >= end) {
          ref.current.textContent = end + (end === 1000 ? "+" : "");
        } else {
          ref.current.textContent = start + (end === 1000 ? "+" : "");
          requestAnimationFrame(update);
        }
      };
      update();
    };
    animateCount(secuRef, 100);
    animateCount(supportRef, 24);
    animateCount(usersRef, 1000);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Section Hero - En-tête principal avec dégradé et animation de fond */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-sky-800 text-white overflow-hidden">
        {/* Motif de grille en arrière-plan avec effet de fondu */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        {/* Effet de particules */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-2 h-2 bg-white rounded-full animate-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
          <div className="absolute w-3 h-3 bg-white rounded-full animate-float" style={{ top: '40%', left: '30%', animationDelay: '1s' }}></div>
          <div className="absolute w-2 h-2 bg-white rounded-full animate-float" style={{ top: '60%', left: '50%', animationDelay: '2s' }}></div>
          <div className="absolute w-3 h-3 bg-white rounded-full animate-float" style={{ top: '80%', left: '70%', animationDelay: '3s' }}></div>
        </div>
        <div className="relative container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Plateforme dédiée aux Médecins et Administrateurs
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
              Accédez à un système moderne et sécurisé pour la gestion des dossiers médicaux, réservé exclusivement aux professionnels de santé et aux administrateurs de clinique.
            </p>
            {/* Boutons d'action principaux */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/login" 
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Se connecter (Médecin ou Administrateur)
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <a
                href="#features"
                className="group bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-bounce"
              >
                <span className="flex items-center justify-center gap-2">
                  Découvrir la démo
                  <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Statistiques - Chiffres clés avec animations au survol */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistique 1 - Sécurité */}
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div ref={secuRef} className="text-5xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">0</div>
              <div className="text-xl text-gray-700 font-medium">Sécurité des données</div>
              <div className="mt-4 text-gray-500">Protection maximale de vos informations sensibles</div>
            </div>
            {/* Statistique 2 - Support */}
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div ref={supportRef} className="text-5xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">0</div>
              <div className="text-xl text-gray-700 font-medium">Support technique</div>
              <div className="mt-4 text-gray-500">Une équipe dédiée à votre service</div>
            </div>
            {/* Statistique 3 - Utilisateurs */}
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div ref={usersRef} className="text-5xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">0</div>
              <div className="text-xl text-gray-700 font-medium">Utilisateurs satisfaits</div>
              <div className="mt-4 text-gray-500">Rejoignez notre communauté grandissante</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités - Présentation des principales fonctionnalités */}
      <div id="features" className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600">
            Fonctionnalités pour Médecins & Administrateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 - Gestion des Patients */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-sky-300 shadow-lg border-4 border-white">
                  <span className="text-6xl">🧑‍⚕️</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Gestion des Patients</h3>
              <p className="text-gray-600 leading-relaxed">
                Accédez, modifiez et suivez les dossiers médicaux de vos patients en toute sécurité.
              </p>
            </div>
            {/* Carte 2 - Gestion des Rendez-vous */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-sky-300 shadow-lg border-4 border-white">
                  <span className="text-6xl">📅</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Gestion des Rendez-vous</h3>
              <p className="text-gray-600 leading-relaxed">
                Planifiez, gérez et suivez les rendez-vous médicaux pour une organisation optimale.
              </p>
            </div>
            {/* Carte 3 - Statistiques & Administration */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-sky-300 shadow-lg border-4 border-white">
                  <span className="text-6xl">📊</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Statistiques & Administration</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualisez les statistiques, gérez les utilisateurs (administrateurs) et optimisez la gestion de la clinique.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Avantages - Pourquoi choisir notre solution */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Liste des avantages avec icônes et effets de survol */}
            <div>
              <h2 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600">
                Pourquoi nous choisir ?
              </h2>
              <div className="space-y-8">
                {/* Avantage 1 - Interface intuitive */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">Interface intuitive</h3>
                    <p className="text-gray-600 mt-2 leading-relaxed">Une expérience utilisateur fluide et facile à prendre en main</p>
                  </div>
                </div>
                {/* Avantage 2 - Support 24/7 */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">Support 24/7</h3>
                    <p className="text-gray-600 mt-2 leading-relaxed">Une équipe dédiée à votre service à tout moment</p>
                  </div>
                </div>
                {/* Avantage 3 - Mises à jour régulières */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">Mises à jour régulières</h3>
                    <p className="text-gray-600 mt-2 leading-relaxed">Des améliorations constantes pour une meilleure expérience</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Image d'illustration avec ombre et coins arrondis */}
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <Image
                src="/images/med-team.webp"
                alt="Équipe médicale"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA - Appel à l'action */}
      <div className="relative bg-gradient-to-br from-blue-600 to-sky-800 text-white py-24 overflow-hidden">
        {/* Motif de grille en arrière-plan */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Prêt à commencer ?</h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl mx-auto">
            Rejoignez les nombreuses cliniques qui nous font confiance pour une gestion médicale optimale
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            <span className="flex items-center justify-center gap-3">
              Commencer maintenant
              <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
