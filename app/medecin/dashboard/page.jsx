"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardMedecin() {
  const router = useRouter();
  const [autorisé, setAutorisé] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/medecin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAutorisé(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!autorisé) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-100 text-gray-800">
      <h1 className="text-4xl font-bold">
        Bienvenue dans le dashboard médecin
      </h1>
    </main>
  );
}
