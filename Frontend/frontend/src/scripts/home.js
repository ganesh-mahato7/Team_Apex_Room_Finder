// scripts/home.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Explore Category Cards ──
export const exploreItems = [
  { title: "Rooms",      color: "#e8f1ff", iconColor: "#2b7fff" },
  { title: "Apartments", color: "#e8f4ee", iconColor: "#38a169" },
  { title: "Flats",      color: "#fef3e2", iconColor: "#d97706" },
  { title: "Near You",   color: "#fde8e8", iconColor: "#e53e3e" },
];

// ── Stats ──
export const stats = [
  { value: "—", label: "Properties"    },
  { value: "—", label: "Locations"     },
  { value: "—", label: "Happy Renters" },
  { value: "—", label: "Landlords"     },
];

// ── Filter Tags ──
export const tags = ["All", "Room", "Apartment", "Flat"];

// ── Popular Cities ──
export const popularCities = ["Kathmandu", "Pokhara", "Lalitpur"];

// ── Helper: get valid role ──
function getRole() {
  const r = localStorage.getItem("role");
  if (!r || r === "null" || r === "undefined" || r === "") return null;
  return r;
}

// ── Custom Hook ──
export function useHomeLogic() {
  const navigate = useNavigate();

  const [role,        setRole]        = useState(getRole());
  const [activeTag,   setActiveTag]   = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Re-check role whenever localStorage changes
  useEffect(() => {
    const handleStorage = () => setRole(getRole());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const goToAddProperty = () => navigate("/add-property");
  const goToSignIn      = () => navigate("/signin");
  const goToHome        = () => navigate("/");
  const goToRooms       = () => navigate("/rooms");
  const goToAbout       = () => navigate("/about");

  const goToProperties = (category = "") => {
    if (category) {
      navigate(`/properties?type=${encodeURIComponent(category)}`);
    } else {
      navigate("/properties");
    }
  };

  const handleCityClick = (city) => setSearchQuery(city);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}&type=${activeTag}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setRole(null);
    navigate("/");
  };

  return {
    role,
    activeTag,
    setActiveTag,
    searchQuery,
    setSearchQuery,
    goToAddProperty,
    goToSignIn,
    goToHome,
    goToRooms,
    goToAbout,
    goToProperties,
    handleCityClick,
    handleSearch,
    handleSearchKeyDown,
    handleLogout,
  };
}