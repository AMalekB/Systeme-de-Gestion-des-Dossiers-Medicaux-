<<<<<<< HEAD
// lib/auth.js
=======
>>>>>>> adda6cab6f242e6938251043e9fcab3739778aa8
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecret";

<<<<<<< HEAD
export function verifyJwtAndRole(req, roleRequis) {
  const authHeader = req.headers.get("authorization") || "";

  // Récupère ce qui suit “Bearer ”
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
=======
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
>>>>>>> adda6cab6f242e6938251043e9fcab3739778aa8
      payload: null,
    };
  }

  try {
    const payload = jwt.verify(token, SECRET);
<<<<<<< HEAD
    if (payload.role !== roleRequis) {
=======
    // Vérifier que le rôle correspond
    if (payload.role !== roleRequis) {
      // Rôle incorrect => 403 Forbidden
>>>>>>> adda6cab6f242e6938251043e9fcab3739778aa8
      return {
        error: NextResponse.json(
          { message: "Accès interdit : rôle non autorisé" },
          { status: 403 }
        ),
        payload: null,
      };
    }
<<<<<<< HEAD
    return { error: null, payload };
  } catch {
=======
    // Tout est OK
    return { error: null, payload };
  } catch (err) {
    // Token invalide ou expiré
>>>>>>> adda6cab6f242e6938251043e9fcab3739778aa8
    return {
      error: NextResponse.json(
        { message: "Token invalide ou expiré" },
        { status: 401 }
      ),
      payload: null,
    };
  }
}
