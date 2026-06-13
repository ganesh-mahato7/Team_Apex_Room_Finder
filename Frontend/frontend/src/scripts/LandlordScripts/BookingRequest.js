// bookingService.js
// Handles all API calls related to booking requests and confirmed bookings.
// Assumes a REST backend connected to PostgreSQL (e.g. Express / Django / FastAPI).
// Adjust BASE_URL to match your backend server address.

const BASE_URL = "http://localhost:5000/api";
// ─────────────────────────────────────────────────────────────────────────────
// BOOKING REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all pending booking requests from the database.
 * GET /api/booking-requests
 *
 * Expected response shape (array of objects):
 * [
 *   {
 *     id: 1,
 *     tenant_name: "Ram Sharma",
 *     initials: "RS",               // can be derived on frontend if absent
 *     property: "2BHK Apartment, Kathmandu",
 *     request_date: "2026-05-04",
 *     message: "Interested in the 2BHK apartment...",
 *     token_amount: 5000,
 *     proposed_move_in: "2026-06-01",
 *     monthly_rent: 25000,
 *     status: "pending"
 *   },
 *   ...
 * ]
 */
export async function fetchBookingRequests() {
  const res = await fetch(`${BASE_URL}/booking-requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch booking requests (${res.status})`);
  }

  return res.json(); // returns array
}

export async function fetchConfirmedCount() {
  const res = await fetch(
    "http://localhost:5000/api/confirmed-count"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch confirmed count");
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCEPT A BOOKING REQUEST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accept a booking request.
 * Marks it as "confirmed" in the booking_requests table AND
 * inserts a row into the confirmed_bookings table.
 *
 * PUT /api/booking-requests/:id/accept
 *
 * The backend should:
 *  1. UPDATE booking_requests SET status = 'confirmed' WHERE id = :id
 *  2. INSERT INTO confirmed_bookings (tenant_name, property, move_in_date, monthly_rent, ...)
 *
 * @param {number|string} id  - booking request ID
 */
export async function acceptBookingRequest(id) {
  const res = await fetch(`${BASE_URL}/booking-requests/${id}/accept`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to accept booking request (${res.status})`);
  }

  return res.json(); // returns the newly created confirmed booking record
}

// ─────────────────────────────────────────────────────────────────────────────
// REJECT / DELETE A BOOKING REQUEST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reject and permanently delete a booking request.
 * DELETE /api/booking-requests/:id
 *
 * The backend should:
 *  DELETE FROM booking_requests WHERE id = :id
 *
 * @param {number|string} id  - booking request ID
 */
export async function rejectBookingRequest(id) {
  const res = await fetch(`${BASE_URL}/booking-requests/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to reject booking request (${res.status})`);
  }

  return res.json(); // returns { success: true, id }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER – derive initials from a full name (used if DB doesn't store initials)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate two-letter initials from a full name string.
 * "Ram Sharma" → "RS"
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER – format a raw DB date string to a readable label
// "2026-05-04" → "May 4, 2026"
// ─────────────────────────────────────────────────────────────────────────────

export function formatDate(dateStr = "") {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER – format a move-in date to "Month YYYY"
// "2026-06-01" → "June 2026"
// ─────────────────────────────────────────────────────────────────────────────

export function formatMoveIn(dateStr = "") {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER – format currency (NPR)
// 5000 → "Rs. 5,000"
// ─────────────────────────────────────────────────────────────────────────────

export function formatCurrency(amount) {
  if (amount == null) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-NP")}`;
}