import { NextResponse } from "next/server";
import { verifyJwtAndRole } from "../../../../lib/auth";

export function GET(req) {
  const { error, payload } = verifyJwtAndRole(req, "MEDECIN");
  if (error) return error;
  return NextResponse.json({
    message: "MEDECIN authentifié",
    userId: payload.id,
  });
}
