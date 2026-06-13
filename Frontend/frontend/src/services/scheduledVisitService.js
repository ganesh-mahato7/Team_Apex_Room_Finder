import api from "../api";

export const getAllVisits = async () => (await api.get("/scheduled-visits")).data;

export const patchVisitStatus = async (visitId, status) =>
  (await api.patch(`/scheduled-visits/${visitId}/status`, { status })).data;

export const patchRescheduleVisit = async (visitId, visit_date, visit_time) =>
  (await api.patch(`/scheduled-visits/${visitId}/reschedule`, {
    visit_date,
    visit_time,
  })).data;