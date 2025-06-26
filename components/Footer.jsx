import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-0 pb-12 relative">
      {/* Mini-barre dégradée en haut du footer */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-700 mb-6 animate-pulse"></div>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🩺</span> À propos
            </h3>
            <p className="text-gray-400">
              Plateforme moderne et sécurisée réservée aux <span className="text-blue-400 font-semibold">médecins</span> et <span className="text-blue-300 font-semibold">administrateurs</span> de clinique.
            </p>
          </div>
          {/* Colonne 2 - Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Liens rapides
            </h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-blue-400 transition-all font-medium">Fonctionnalités</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-all font-medium">Contact</Link></li>
            </ul>
          </div>
          {/* Colonne 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span> Support
            </h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-all font-medium">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-all font-medium">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-all font-medium">Assistance</Link></li>
            </ul>
          </div>
          {/* Colonne 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📞</span> Contact
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@sgdm.com</li>
              <li>Tél: +1 800 452 5265</li>
              <li>Adresse: Ottawa,ON, Canada</li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Système de Gestion des Dossiers Médicaux. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 