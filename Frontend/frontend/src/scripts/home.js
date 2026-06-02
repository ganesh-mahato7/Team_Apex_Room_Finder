// Frontend/src/scripts/home.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const exploreItems = [
  { title: "Rooms",      color: "#e8f1ff", iconColor: "#2b7fff" },
  { title: "Apartments", color: "#e8f4ee", iconColor: "#38a169" },
  { title: "Flats",      color: "#fef3e2", iconColor: "#d97706" },
  { title: "Near You",   color: "#fde8e8", iconColor: "#e53e3e" },
];

export const stats = [
  { value: "—", label: "Properties"    },
  { value: "—", label: "Locations"     },
  { value: "—", label: "Happy Renters" },
  { value: "—", label: "Landlords"     },
];

export const tags          = ["All", "Room", "Apartment", "Flat"];
export const popularCities = ["Kathmandu", "Pokhara", "Lalitpur"];

export function useHomeLogic() {
  const navigate               = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const [activeTag,    setActiveTag]    = useState("All");
  const [searchQuery,  setSearchQuery]  = useState("");

  const goToAddProperty = () => navigate("/add-property");
  const goToSignIn      = () => navigate("/signin");
  const goToHome        = () => navigate("/");
  const goToRooms       = () => navigate("/rooms");
  const goToAbout       = () => navigate("/about");

  const goToProperties = (category = "") => {
    if (category) navigate(`/properties?type=${encodeURIComponent(category)}`);
    else          navigate("/properties");
  };

  const handleCityClick     = (city) => setSearchQuery(city);
  const handleSearchKeyDown = (e)    => { if (e.key === "Enter") handleSearch(); };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}&type=${activeTag}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return {
    user,
    isLoggedIn,
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