"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/**
 * Page de connexion du système de gestion des dossiers médicaux
 * Permet aux utilisateurs de se connecter avec leur email et mot de passe
 * Gère la redirection en fonction du rôle (ADMIN ou MEDECIN)
 */
export default function Connexion() {
  // États pour gérer le formulaire et les retours utilisateur
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Gère la soumission du formulaire de connexion
   * Vérifie les identifiants et redirige selon le rôle de l'utilisateur
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const handleConnexion = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Appel à l'API de connexion
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe invalide");
        return;
      }

      // Stockage du token et du rôle dans le localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirection selon le rôle de l'utilisateur
      if (data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.role === "MEDECIN") {
        router.push("/medecin/dashboard");
      } else {
        setError("Rôle inconnu !");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Conteneur principal avec dégradé de fond
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto px-4">
        {/* Carte principale avec ombre et coins arrondis */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row">
            {/* Section gauche - Image d'illustration */}
            <div className="w-full md:w-1/2 relative h-[300px] md:h-[600px]">
              <Image
                src="/images/equipe-m.webp"
                alt="Équipe médicale"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={100}
              />
            </div>

            {/* Section droite - Formulaire de connexion */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              {/* En-tête du formulaire */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
                <p className="text-gray-600 mt-2">Bienvenue ! Veuillez vous connecter</p>
              </div>

              {/* Affichage des messages d'erreur */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Formulaire de connexion */}
              <form onSubmit={handleConnexion} className="space-y-6">
                {/* Champ email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="exemple@clinique.com"
                  />
                </div>

                {/* Champ mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                {/* Options de connexion et lien mot de passe oublié */}
                <div className="flex items-center justify-between">
                  {/* Option "Se souvenir de moi" */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>
                  {/* Lien mot de passe oublié */}
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Bouton de connexion avec animation de chargement */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      {/* Animation de chargement */}
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>

              {/* Section d'aide et support */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Besoin d'aide ?{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-800">
                    Contactez le support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
