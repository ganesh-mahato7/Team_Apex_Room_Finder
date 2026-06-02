// Frontend/src/services/propertyService.js
// All property API calls in one place

const BASE_URL = "http://localhost:5000/api/v1/properties";

// ── Get all properties ──
export const getAllProperties = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res   = await fetch(`${BASE_URL}?${query}`);
  return res.json();
};

// ── Get single property ──
export const getPropertyById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

// ── Add property (landlord only) ──
export const addProperty = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method:  "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body:    formData, // FormData for image upload
  });
  return res.json();
};

// ── Get my properties (landlord) ──
export const getMyProperties = async (token) => {
  const res = await fetch(`${BASE_URL}/my-properties`, {
    method:  "GET",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.json();
};

// ── Delete property (landlord/admin) ──
export const deleteProperty = async (id, token) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method:  "DELETE",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.json();
};