// lib/auth.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function verifyJwtAndRole(req, roleRequis) {
  const authHeader = req.headers.get("authorization") || "";

  // Récupère la partie qui suit "Bearer "
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

    // Vérifie que le rôle correspond
    if (payload.role !== roleRequis) {
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
  } catch {
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
