// lib/auth.js
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const SECRET = process.env.JWT_SECRET || "supersecret"

/**
 * Vérifie le token JWT et que l'utilisateur a un des rôles autorisés
 * @param {Request} req - La requête Next.js
 * @param {string|string[]} roleRequis - Un rôle ou une liste de rôles autorisés
 * @returns { error: NextResponse|null, payload: object|null }
 */
export function verifyJwtAndRole(req, roleRequis) {
  const authHeader = req.headers.get("authorization") || ""

  let token = ""
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim().replace(/^"|"$/g, "")
  }

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Non authentifié – aucun token trouvé" },
        { status: 401 }
      ),
      payload: null,
    }
  }

  try {
    const payload = jwt.verify(token, SECRET)

    // Accepte un seul rôle ou un tableau de rôles
    const roles = Array.isArray(roleRequis) ? roleRequis : [roleRequis]

    if (!roles.includes(payload.role)) {
      return {
        error: NextResponse.json(
          { message: "Accès interdit : rôle non autorisé" },
          { status: 403 }
        ),
        payload: null,
      }
    }

    return { error: null, payload }
  } catch {
    return {
      error: NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      ),
      payload: null,
    }
  }
}
