"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  const router = useRouter();
  const [autorisé, setAutorisé] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
<<<<<<< HEAD
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/admin/dashboard", {
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
=======
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
      router.push("/login");
    } else {
      setAutorisé(true);
    }
  }, [router]);

  if (!autorisé) {
    return null;
  }
>>>>>>> adda6cab6f242e6938251043e9fcab3739778aa8

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sky-100 text-gray-800">
      <h1 className="text-4xl font-bold">Bienvenue dans le dashboard admin</h1>
    </main>
  );
}
