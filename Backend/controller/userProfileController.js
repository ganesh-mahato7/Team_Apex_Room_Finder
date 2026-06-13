// controller/userProfileController.js

const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} = require("../model/userProfileModel");

// ── GET MY PROFILE ──
const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const stats = await getUserStats(req.user.id);
    res.json({ user, stats });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── UPDATE MY PROFILE ──
const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updated = await updateUserProfile(req.user.id, { name, phone, bio });
    res.json({ message: "Profile updated successfully!", user: updated });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };