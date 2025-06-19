"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import CalendrierRendezVous from "@/components/CalendrierRendezVous";

export default function MedecinRendezVousPage() {
  return (
    <LayoutDashboard>
      <h2 className="text-2xl font-bold mb-4">Mes rendez-vous</h2>
      <CalendrierRendezVous apiBase="/api/medecin/rendezvous" />
    </LayoutDashboard>
  );
}
