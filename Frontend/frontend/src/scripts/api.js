// scripts/api.js
// Central API helper — attaches auth token automatically

const BASE = "http://localhost:5000/api/v1";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Rooms ──
export const fetchRooms = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();
  return apiFetch(`/rooms${qs ? `?${qs}` : ""}`);
};

export const fetchRoomById = (id) => apiFetch(`/rooms/${id}`);

// ── User Dashboard ──
export const fetchMyProfile  = ()              => apiFetch("/user/profile");
export const updateMyProfile = (body)          => apiFetch("/user/profile", { method: "PUT", body: JSON.stringify(body) });
export const fetchMyBookmarks = ()             => apiFetch("/user/bookmarks");
export const toggleBookmarkApi = (roomId)      => apiFetch(`/user/bookmarks/${roomId}`, { method: "POST" });