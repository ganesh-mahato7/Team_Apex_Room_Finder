import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Static Data 

export const exploreItems = [
  { title: "Rooms",      count: "120 listings", color: "#e8f1ff", iconColor: "#2b7fff" },
  { title: "Apartments", count: "80 listings",  color: "#e8f4ee", iconColor: "#38a169" },
  { title: "Flats",      count: "65 listings",  color: "#fef3e2", iconColor: "#d97706" },
  { title: "Near You",   count: "50 listings",  color: "#fde8e8", iconColor: "#e53e3e" },
];

export const stats = [
  { value: "265+",  label: "Properties"    },
  { value: "40+",   label: "Locations"     },
  { value: "1.2k+", label: "Happy Renters" },
  { value: "500+",  label: "Landlords"     },
];

export const tags = ["All", "Room", "Apartment", "Flat"];

export const popularCities = ["Kathmandu", "Pokhara", "Lalitpur"];

//  Custom Hook 

export function useHomeLogic() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [activeTag, setActiveTag]     = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const goToAddProperty = () => navigate("/add-property");
  const goToSignIn      = () => navigate("/signin");
  const goToHome        = () => navigate("/");
  const goToRooms       = () => navigate("/rooms");
  const goToAbout       = () => navigate("/about");
  const goToProperties  = () => navigate("/properties");

  const handleCityClick = (city) => setSearchQuery(city);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}&type=${activeTag}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
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
  };
}