"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "@/lib/auth";
import LayoutDashboard from "@/components/LayoutDashboard";

export default function DashboardAdmin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const user = decodeToken(token);
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    setAutorise(true);

    // → Fetch des médecins une fois autorisé
    fetch("/api/medecins")
      .then((res) => res.json())
      .then((data) => setMedecins(data))
      .catch(console.error);
  }, [router]);

  if (!autorise) return null;

  return (
    <LayoutDashboard>
          <h2 className="text-2xl font-bold mb-4">Bienvenue Admin</h2>
          <p>Ici, vous pouvez consulter tous. </p>
        </LayoutDashboard>
  );
 


    

}
