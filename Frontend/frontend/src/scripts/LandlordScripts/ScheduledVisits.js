// hooks/useScheduledVisits.js
// All state, side-effects, data-grouping, and action handlers for
// the ScheduledVisits page live here.
// The JSX component is purely presentational — it only calls this hook.

import { useState, useEffect } from "react";
import {
  getAllVisits,
  patchVisitStatus,
  patchRescheduleVisit,
} from "../../service/LandlordService/Scheduledvisitsservice";

// ── Tab config ────────────────────────────────────────────────────────────────
export const TABS = ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"];

// ── Date display helpers ──────────────────────────────────────────────────────
export function getDay(dateStr) {
  if (!dateStr) return "--";
  return new Date(dateStr).getDate().toString();
}

export function getMonth(dateStr) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleString("default", { month: "short" });
}

// ── Helper: group a flat visits array into { pending, accepted, … } ───────────
function groupByStatus(visitsArray) {
  const grouped = {
    pending: [],
    accepted: [],
    rejected: [],
    completed: [],
    cancelled: [],
  };
  (visitsArray || []).forEach((visit) => {
    if (grouped[visit.status]) {
      grouped[visit.status].push(visit);
    }
  });
  return grouped;
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useScheduledVisits() {

  // ── State ──────────────────────────────────────────────────────────────────
  const [visits, setVisits] = useState({
    pending: [],
    accepted: [],
    rejected: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [activeTab, setActiveTab]           = useState("Pending");
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // visit open in modal

  // ── Load all visits on mount ───────────────────────────────────────────────
  useEffect(() => {
  const loadVisits = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllVisits();
      const grouped = groupByStatus(response.data.data);
      setVisits(grouped);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load visits"
      );
    } finally {
      setLoading(false);
    }
  };

  loadVisits();
}, []);

  // ── Update visit status (confirm / reject / complete / cancel) ─────────────
  // Transitions allowed by the backend:
  //   pending  → accepted | rejected
  //   accepted → completed | cancelled
  const handleStatusChange = async (visitId, newStatus) => {
    try {
      const response    = await patchVisitStatus(visitId, newStatus); // axios call
      const updatedVisit = response.data.data;

      // Move the card locally without a full refetch (snappy UX)
      setVisits((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = next[key].filter((v) => v.id !== visitId);
        });
        next[newStatus] = [updatedVisit, ...next[newStatus]];
        return next;
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Status update failed");
    }
  };

  // ── Open / close the reschedule modal ─────────────────────────────────────
  const openReschedule  = (visit) => setRescheduleTarget(visit);
  const closeReschedule = ()      => setRescheduleTarget(null);

  // ── Save rescheduled date+time (called by RescheduleModal on submit) ───────
  // Returns { success: true } or { success: false, message: "..." }
  // so the modal can show an inline error without closing.
  const handleRescheduleSave = async (visitId, newDate, newTime) => {
    try {
      const response    = await patchRescheduleVisit(visitId, newDate, newTime); // axios call
      const updatedVisit = response.data.data;

      // Update the card in the accepted bucket in place
      setVisits((prev) => ({
        ...prev,
        accepted: prev.accepted.map((v) =>
          v.id === updatedVisit.id ? updatedVisit : v
        ),
      }));

      closeReschedule();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to reschedule",
      };
    }
  };

  // ── Tab count helper ───────────────────────────────────────────────────────
  const tabCount = (tab) => visits[tab.toLowerCase()]?.length || 0;

  // ── Exposed API ───────────────────────────────────────────────────────────
  return {
    // State
    visits,
    loading,
    error,
    activeTab,
    rescheduleTarget,

    // Actions
    setActiveTab,
    handleStatusChange,
    openReschedule,
    closeReschedule,
    handleRescheduleSave,

    // Helpers
    tabCount,
    getDay,
    getMonth,
  };
}