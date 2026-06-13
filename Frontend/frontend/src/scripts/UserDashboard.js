// scripts/UserDashboard.js

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyProfile,
  updateMyProfile,
  fetchMyBookmarks,
  toggleBookmarkApi,
  fetchRooms,
} from "./api";

// ── Auth guard ──
export function useUserAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    const role  = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "user") {
      navigate("/signin");
    }
  }, [navigate]);
}

// ── Profile hook ──
export function useUserProfile() {
  const [profile,    setProfile]    = useState(null);
  const [stats,      setStats]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [editMode,   setEditMode]   = useState(false);
  const [form,       setForm]       = useState({ name: "", phone: "", bio: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [error,      setError]      = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMyProfile();
      setProfile(data.user);
      setStats(data.stats || {});
      setForm({
        name:  data.user.name  || "",
        phone: data.user.phone || "",
        bio:   data.user.bio   || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    try {
      const data = await updateMyProfile(form);
      setProfile(data.user);
      // Keep localStorage user in sync
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, name: data.user.name }));
      setEditMode(false);
      setSuccessMsg("Profile updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    profile, stats, loading, saving, editMode, setEditMode,
    form, handleChange, handleSave, successMsg, error,
  };
}

// ── Bookmarks hook ──
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMyBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleBookmark = async (roomId) => {
    try {
      const res = await toggleBookmarkApi(roomId);
      if (!res.bookmarked) {
        setBookmarks((prev) => prev.filter((b) => b.id !== roomId));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return { bookmarks, loading, error, toggleBookmark, reload: load };
}

// ── Rooms browse hook ──
export function useRoomsBrowse() {
  const navigate = useNavigate();

  const [rooms,      setRooms]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [filters, setFilters] = useState({
    search:     "",
    type:       "",
    minRent:    "",
    maxRent:    "",
    facilities: [],
    page:       1,
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Load bookmarked IDs for logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (token && role === "user") {
      fetchMyBookmarks()
        .then((d) => setBookmarkedIds(new Set((d.bookmarks || []).map((b) => b.id))))
        .catch(() => {});
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        search:     filters.search,
        type:       filters.type,
        minRent:    filters.minRent,
        maxRent:    filters.maxRent,
        facilities: filters.facilities.join(","),
        page:       filters.page,
        limit:      9,
      };
      const data = await fetchRooms(params);
      setRooms(data.rooms || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleFacility = (val) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(val)
        ? prev.facilities.filter((f) => f !== val)
        : [...prev.facilities, val],
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({ search: "", type: "", minRent: "", maxRent: "", facilities: [], page: 1 });
  };

  const goToPage  = (p) => setFilters((prev) => ({ ...prev, page: p }));

  const handleToggleBookmark = async (roomId) => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "user") { navigate("/signin"); return; }
    try {
      const res = await toggleBookmarkApi(roomId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        res.bookmarked ? next.add(roomId) : next.delete(roomId);
        return next;
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return {
    rooms, total, totalPages, loading, error,
    filters, setFilter, toggleFacility, resetFilters, goToPage,
    bookmarkedIds, handleToggleBookmark,
    goToRoom: (id) => navigate(`/rooms/${id}`),
  };
}

// ── Room detail hook ──
export function useRoomDetail(id) {
  const navigate = useNavigate();
  const [room,       setRoom]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const { fetchRoomById } = await import("./api");
        const data = await fetchRoomById(id);
        setRoom(data);
        setBookmarked(data.bookmarked || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleToggleBookmark = async () => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "user") { navigate("/signin"); return; }
    try {
      const res = await toggleBookmarkApi(id);
      setBookmarked(res.bookmarked);
    } catch (err) {
      console.error(err.message);
    }
  };

  return {
    room, loading, error, bookmarked, handleToggleBookmark,
    goBack:   () => navigate(-1),
    goToHome: () => navigate("/"),
    goToRooms: () => navigate("/rooms"),
  };
}

// ── Dashboard overview hook ──
export function useDashboardOverview() {
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    fetchRooms({ limit: 6, page: 1 })
      .then((d) => setRecentRooms(d.rooms || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { recentRooms, loading };
}

// ── Logout ──
export function useLogout() {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };
}