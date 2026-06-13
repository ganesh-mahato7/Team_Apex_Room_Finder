// services/scheduledVisitsService.js
// Axios-based API calls for Scheduled Visits.
// Visit requests are created by users (tenants) on the user side.
// This file is used by the landlord side to manage those requests.

import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET all visits (landlord sees all)
export const getAllVisits = () => {
  return Api.get("/api/scheduled-visits");
};

// PATCH update visit status — confirm, reject, complete, cancel
export const patchVisitStatus = (visitId, status) => {
  return Api.patch(`/api/scheduled-visits/${visitId}/status`, { status });
};

// PATCH reschedule an accepted visit
export const patchRescheduleVisit = (visitId, visit_date, visit_time) => {
  return Api.patch(`/api/scheduled-visits/${visitId}/reschedule`, {
    visit_date,
    visit_time,
  });
};