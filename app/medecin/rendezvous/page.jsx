"use client";

import LayoutDashboard from "@/components/LayoutDashboard";
import CalendrierRendezVous from "@/components/CalendrierRendezVous";

export default function MedecinRendezVousPage() {
  return (
    <LayoutDashboard>
      
      <CalendrierRendezVous apiBase="/api/medecin/rendezvous" />
    </LayoutDashboard>
  );
}
