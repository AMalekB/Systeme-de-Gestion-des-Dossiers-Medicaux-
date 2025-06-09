"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard";

export default function DashboardAdmin() {
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAutorise(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!autorise) return null;

  return (
    <LayoutDashboard >
          <h2 className="text-2xl text-black font-bold mb-4">Bienvenue Admin</h2>
          <p className="text-black">Ici, vous pouvez consulter tous. </p>
        </LayoutDashboard>
  );
 


    

}
