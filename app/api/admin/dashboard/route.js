import { NextResponse } from "next/server";
import { verifyJwtAndRole } from "../../../../lib/auth";

export function GET(req) {
  // 1) Vérification du token + rôle ADMIN
  const { error, payload } = verifyJwtAndRole(req, "ADMIN");
  if (error) {
    return error; // renvoie 401 ou 403 si pas autorisé
  }

  // 2) Si tout est OK, on renvoie un simple JSON de confirmation
  return NextResponse.json({
    message: "ADMIN authentifié",
    userId: payload.id,
  });
}
