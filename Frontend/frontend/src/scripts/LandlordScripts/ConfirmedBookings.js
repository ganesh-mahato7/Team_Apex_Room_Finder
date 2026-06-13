

const BASE_URL = "http://localhost:5000/api";


export async function fetchConfirmedBookings() {
  const res = await fetch(`${BASE_URL}/confirmed-bookings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || `Failed to fetch confirmed bookings (${res.status})`
    );
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// REMOVE CONFIRMED BOOKING
// ─────────────────────────────────────────────────────────────

/**
 * Delete a confirmed booking (remove tenant)
 * DELETE /api/confirmed-bookings/:id
 *
 * @param {number|string} id
 */
export async function removeConfirmedBooking(id) {
  const res = await fetch(`${BASE_URL}/confirmed-bookings/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || `Failed to remove confirmed booking (${res.status})`
    );
  }

  return res.json();
}

export async function fetchBookingRequestCount() {
  const res = await fetch(
    "http://localhost:5000/api/booking-requests-count"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch booking request count");
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// HELPER – format currency (optional reuse from booking service)
// ─────────────────────────────────────────────────────────────

export function formatCurrency(amount) {
  if (amount == null) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-NP")}`;
}

// ─────────────────────────────────────────────────────────────
// HELPER – initials from name
// ─────────────────────────────────────────────────────────────

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─────────────────────────────────────────────────────────────
// HELPER – format date
// ─────────────────────────────────────────────────────────────

export function formatDate(dateStr = "") {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}