// lib/auth.js

// ——————— CLIENT-SIDE: décoder le JWT dans le navigateur ———————
import { jwtDecode } from "jwt-decode";

/**
 * Decode a JWT token stored in localStorage to extract its payload.
 * @param {string} token — The JWT string.
 * @returns {object|null} — The decoded payload (e.g. { id, role, iat, exp }) or null if invalid.
 */
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

// ——————— SERVER-SIDE: vérifier JWT + rôle dans tes API routes ———————
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Vérifie la présence d'un JWT Bearer dans l'en-tête Authorization
 * et s'assure que son payload contient le rôle requis.
 *
 * @param {NextRequest} req — La requête entrante.
 * @param {string} roleRequis — Le rôle attendu ("ADMIN" ou "MEDECIN").
 * @returns {{ error: NextResponse|null, payload: object|null }}
 */
export function verifyJwtAndRole(req, roleRequis) {
  const authHeader = req.headers.get("authorization") || "";
  let token = "";

  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim().replace(/^"|"$/g, "");
  }

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Non authentifié – aucun token trouvé" },
        { status: 401 }
      ),
      payload: null,
    };
  }

  try {
    const payload = jwt.verify(token, SECRET);

    if (payload.role !== roleRequis) {
      return {
        error: NextResponse.json(
          { message: "Accès interdit : rôle non autorisé" },
          { status: 403 }
        ),
        payload: null,
      };
    }

    return { error: null, payload };
  } catch {
    return {
      error: NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      ),
      payload: null,
    };
  }
}
