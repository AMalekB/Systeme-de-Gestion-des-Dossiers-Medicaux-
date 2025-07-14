"use client";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import RendezvousModal from "./RendezvousModal";
import RendezvousDayModal from "./RendezvousDayModal";

// 🔧 Utilitaire pour formater la date ISO (YYYY-MM-DD)
const formatDate = (date) => date.toISOString().split("T")[0];

export default function CalendrierRendezVous({ apiBase = "/api/rendezvous" }) {
  const [events, setEvents] = useState([]);
  const [modalDate, setModalDate] = useState(null);
  const [editingRdv, setEditingRdv] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showWeekendModal, setShowWeekendModal] = useState(false);
  const [showFerieModal, setShowFerieModal] = useState(false);
  const [joursFeries, setJoursFeries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const typeIcons = {
    Urgence: { icon: "🚨", color: "#ef4444" },
    Vaccin: { icon: "💉", color: "#0ea5e9" },
    Contrôle: { icon: "🩺", color: "#10b981" },
    Suivi: { icon: "📋", color: "#6366f1" },
    Bilan: { icon: "📈", color: "#22c55e" },
    Consultation: { icon: "👨‍⚕️", color: "#3b82f6" },
    "Renouvellement prescription": { icon: "💊", color: "#8b5cf6" },
    Naissance: { icon: "👶", color: "#f472b6" },
    Contraception: { icon: "🔒", color: "#a855f7" },
    Grossesse: { icon: "🤰", color: "#ec4899" },
    Allaitement: { icon: "🍼", color: "#06b6d4" },
    Examen: { icon: "📄", color: "#f59e0b" },
    Certificat: { icon: "📃", color: "#facc15" },
    Orientation: { icon: "🧭", color: "#3b82f6" },
    Surveillance: { icon: "🔍", color: "#f97316" },
    Diagnostic: { icon: "🧪", color: "#10b981" },
    Intervention: { icon: "🛠️", color: "#ef4444" },
    Retrait: { icon: "✂️", color: "#f43f5e" },
    Traitement: { icon: "💊", color: "#7c3aed" },
    Référence: { icon: "🔗", color: "#0d9488" },
    Dépistage: { icon: "🧬", color: "#2563eb" },
    Détresse: { icon: "⚠️", color: "#b91c1c" },
    Autre: { icon: "❓", color: "#9ca3af" },
  };

  // Chargement des jours fériés
  useEffect(() => {
    const fetchFeries = async () => {
      try {
        const res = await fetch(
          "https://date.nager.at/api/v3/PublicHolidays/2025/CA"
        );
        const data = await res.json();
        setJoursFeries(data.map((f) => f.date));
      } catch (err) {
        console.error("Erreur chargement jours fériés :", err);
      }
    };
    fetchFeries();
  }, []);

  // Chargement des rendez-vous
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(apiBase, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur chargement rendez-vous");
        const data = await res.json();
        const calendarEvents = data.map((r) => {
          const type = r.typeConsultation;
          const color = typeIcons[type]?.color || "#3B82F6";
          return {
            id: r.id.toString(),
            title: `${type} - ${r.patient?.nom || ""} ${
              r.patient?.prenom || ""
            }`,
            start: r.date,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
              heure: r.heure,
              originalData: {
                id: r.id,
                date: r.date?.substring(0, 10),
                heure: r.heure,
                typeConsultation: r.typeConsultation,
                rappel: r.rappel,
                patientId: r.patientId,
                medecinId: r.medecinId,
              },
            },
          };
        });
        setEvents(calendarEvents);
      } catch (err) {
        console.error("Erreur chargement rendez-vous :", err);
      }
    };
    if (token) fetchEvents();
  }, [token, refreshKey, apiBase]);

  const handleCreate = async (data) => {
    await fetch(apiBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, date: `${data.date}T00:00:00` }),
    });
    setOpenModal(false);
    setRefreshKey(Date.now());
  };

  const handleUpdate = async (data) => {
    await fetch(`${apiBase}/${editingRdv.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, date: `${data.date}T00:00:00` }),
    });
    setEditingRdv(null);
    setRefreshKey(Date.now());
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce rendez-vous ?")) return;
    await fetch(`${apiBase}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRefreshKey(Date.now());
  };

  return (
    <div className=" p-4 rounded ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-black">
          Calendrier des rendez-vous
        </h2>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          + Ajouter un rendez-vous
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        events={events}
        height="auto"
        titleFormat={{ year: "numeric", month: "long" }}
        buttonText={{ today: "Aujourd’hui" }}
        dayCellDidMount={(info) => {
          const day = info.date.getDay();
          const dateStr = formatDate(info.date);
          if (day === 0 || day === 6) info.el.style.backgroundColor = "#ffe5e5";
          if (joursFeries.includes(dateStr))
            info.el.style.backgroundColor = "#fef3c7";
          if (formatDate(info.date) === formatDate(new Date()))
            info.el.style.backgroundColor = "#dcfce7";
        }}
        eventContent={({ event }) => {
          const { heure } = event.extendedProps;
          const [type, patient] = event.title.split(" - ");
          const info = typeIcons[type] || { icon: "📌", color: "#6b7280" };
          return (
            <div className="text-xs leading-tight">
              <div className="flex items-center gap-1">
                <span style={{ color: info.color }}>{info.icon}</span>
                <span className="font-medium">{type}</span>
              </div>
              <div className="text-gray-100 text-[10px]">{heure}</div>
              <div className="italic text-gray-300 text-[11px]">{patient}</div>
            </div>
          );
        }}
        dateClick={(info) => {
          const day = info.date.getDay();
          const dateStr = formatDate(info.date);
          if (day === 0 || day === 6) return setShowWeekendModal(true);
          if (joursFeries.includes(dateStr)) return setShowFerieModal(true);
          setSelectedDay(dateStr);
          setEditingRdv(null);
        }}
        eventClick={(info) => {
          const clicked = events.find((e) => e.id === info.event.id);
          if (clicked) setEditingRdv(clicked.extendedProps.originalData);
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        eventDisplay="block"
      />

      {openModal && <RendezvousModal onSubmit={handleCreate} rendezvous={{}}  onCancelEdit={() => setOpenModal(false)} />}
      {modalDate && !editingRdv && (
        <RendezvousModal
          onSubmit={handleCreate}
          rendezvous={{ date: modalDate }}
          onCancelEdit={() => setModalDate(null)}
        />
      )}
      {editingRdv && (
        <RendezvousModal onSubmit={handleUpdate} rendezvous={editingRdv}  onCancelEdit={() => setEditingRdv(null)} />
      )}
      {selectedDay && (
        <RendezvousDayModal
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
          onEdit={(rdv) => {
            setEditingRdv({ ...rdv, date: rdv.date?.substring(0, 10) });
            setSelectedDay(null);
          }}
          onDelete={handleDelete}
        />
      )}
      {showWeekendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-md">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Jour de relâche
            </h2>
            <p className="text-gray-700 mb-6">
              Pas de rendez-vous le week-end.
            </p>
            <button
              onClick={() => setShowWeekendModal(false)}
              className="text-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {showFerieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-md">
            <h2 className="text-lg font-bold mb-4 text-yellow-600">
              Jour férié
            </h2>
            <p className="text-gray-700 mb-6">
              Pas de rendez-vous ce jour férié.
            </p>
            <button
              onClick={() => setShowFerieModal(false)}
              className="text-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
