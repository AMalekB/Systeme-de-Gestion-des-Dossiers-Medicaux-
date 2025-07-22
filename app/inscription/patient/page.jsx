"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function InscriptionPatient() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/patient/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Une erreur est survenue");
        return;
      }

      // Stocker le token et rediriger
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.utilisateur.role);

      router.push("/patient/dashboard");
    } catch (err) {
      setError("Erreur serveur. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Inscription Patient
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Prénom</label>
              <input
                type="text"
                {...register("prenom", { required: "Champ requis" })}
                className="input"
              />
              {errors.prenom && <p className="text-sm text-red-500">{errors.prenom.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                {...register("nom", { required: "Champ requis" })}
                className="input"
              />
              {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Adresse e-mail</label>
            <input
              type="email"
              {...register("email", {
                required: "Champ requis",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide" },
              })}
              className="input"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              {...register("motDePasse", {
                required: "Champ requis",
                minLength: { value: 6, message: "Au moins 6 caractères" },
              })}
              className="input"
            />
            {errors.motDePasse && (
              <p className="text-sm text-red-500">{errors.motDePasse.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Date de naissance</label>
            <input
              type="date"
              {...register("dateNaissance", { required: "Champ requis" })}
              className="input"
            />
            {errors.dateNaissance && (
              <p className="text-sm text-red-500">{errors.dateNaissance.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Adresse</label>
            <input
              type="text"
              {...register("adresse", { required: "Champ requis" })}
              className="input"
            />
            {errors.adresse && <p className="text-sm text-red-500">{errors.adresse.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            <input
              type="tel"
              {...register("telephone", { required: "Champ requis" })}
              className="input"
            />
            {errors.telephone && <p className="text-sm text-red-500">{errors.telephone.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Inscription en cours..." : "S’inscrire"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="text-green-700 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        .input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
}
