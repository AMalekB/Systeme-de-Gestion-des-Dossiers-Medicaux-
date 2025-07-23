import { NextResponse } from "next/server";

/**
 * Middleware pour gérer CORS sur les routes API
 */
export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

export const config = {
  matcher: "/api/:path*", // Appliquer le middleware à toutes les routes API
};
    