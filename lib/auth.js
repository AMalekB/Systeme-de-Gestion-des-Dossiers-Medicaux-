import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Vérifie le token présent dans l'en-tête Authorization (Bearer <token>).
 * @param {import("next/server").NextRequest} req
 * @param {"ADMIN"|"MEDECIN"} roleRequis - rôle attendu pour autoriser
 * @returns {{ error: Response|null, payload: any|null }}
 */
export function verifyJwtAndRole(req, roleRequis) {
  const authHeader = req.headers.get("authorization") || ""; // "Bearer xxx"
  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    // Pas de token => 401 Unauthorized
    return {
      error: NextResponse.json({ message: "Non authentifié" }, { status: 401 }),
      payload: null,
    };
  }

  try {
    const payload = jwt.verify(token, SECRET);
    // Vérifier que le rôle correspond
    if (payload.role !== roleRequis) {
      // Rôle incorrect => 403 Forbidden
      return {
        error: NextResponse.json(
          { message: "Accès interdit : rôle non autorisé" },
          { status: 403 }
        ),
        payload: null,
      };
    }
    // Tout est OK
    return { error: null, payload };
  } catch (err) {
    // Token invalide ou expiré
    return {
      error: NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      ),
      payload: null,
    };
  }
}
