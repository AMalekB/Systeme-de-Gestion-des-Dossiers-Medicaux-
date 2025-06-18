import Image from "next/image";
import Link from "next/link";

/**
 * Page d'accueil du système de gestion des dossiers médicaux
 * Cette page présente les principales fonctionnalités et avantages du système
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section Hero - En-tête principal avec dégradé et animation de fond */}
      <div className="relative bg-gradient-to-br from-blue-600 to-sky-800 text-white overflow-hidden">
        {/* Motif de grille en arrière-plan avec effet de fondu */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Système de Gestion des Dossiers Médicaux
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Une solution moderne et sécurisée pour la gestion efficace de votre clinique
            </p>
            {/* Boutons d'action principaux */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Se connecter
              </Link>
              <Link 
                href="#features" 
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Statistiques - Chiffres clés avec animations au survol */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Statistique 1 - Sécurité */}
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Sécurité des données</div>
            </div>
            {/* Statistique 2 - Support */}
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support technique</div>
            </div>
            {/* Statistique 3 - Utilisateurs */}
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Utilisateurs satisfaits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités - Présentation des principales fonctionnalités */}
      <div id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Fonctionnalités</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 - Gestion des Patients */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Gestion des Patients</h3>
              <p className="text-gray-600">
                Accédez facilement aux dossiers médicaux, antécédents et informations vitales de vos patients.
              </p>
            </div>
            {/* Carte 2 - Suivi des Rendez-vous */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Suivi des Rendez-vous</h3>
              <p className="text-gray-600">
                Planifiez et gérez les rendez-vous médicaux de manière efficace et organisée.
              </p>
            </div>
            {/* Carte 3 - Sécurité des Données */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sécurité des Données</h3>
              <p className="text-gray-600">
                Protection avancée des données médicales conformément aux normes de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Avantages - Pourquoi choisir notre solution */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Liste des avantages avec icônes et effets de survol */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Pourquoi nous choisir ?</h2>
              <div className="space-y-6">
                {/* Avantage 1 - Interface intuitive */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Interface intuitive</h3>
                    <p className="text-gray-600">Une expérience utilisateur fluide et facile à prendre en main</p>
                  </div>
                </div>
                {/* Avantage 2 - Support 24/7 */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Support 24/7</h3>
                    <p className="text-gray-600">Une équipe dédiée à votre service à tout moment</p>
                  </div>
                </div>
                {/* Avantage 3 - Mises à jour régulières */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Mises à jour régulières</h3>
                    <p className="text-gray-600">Des améliorations constantes pour une meilleure expérience</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Image d'illustration avec ombre et coins arrondis */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/med-team.webp"
                alt="Équipe médicale"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA - Appel à l'action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez les nombreuses cliniques qui nous font confiance
          </p>
          <Link 
            href="/login" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg transform hover:scale-105 transition-transform"
          >
            Commencer maintenant
          </Link>
        </div>
      </div>

      {/* Footer - Pied de page avec navigation et informations de contact */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Colonne 1 - À propos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">À propos</h3>
              <p className="text-gray-400">
                Système de gestion des dossiers médicaux moderne et sécurisé pour les professionnels de santé.
              </p>
            </div>
            {/* Colonne 2 - Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            {/* Colonne 3 - Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Assistance</Link></li>
              </ul>
            </div>
            {/* Colonne 4 - Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: contact@sgdm.com</li>
                <li>Tél: +1 800 452 5265</li>
                <li>Adresse: Ottawa, Canada</li>
              </ul>
            </div>
          </div>
          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Système de Gestion des Dossiers Médicaux. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
