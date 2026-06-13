// controller/roomController.js

const { getRooms, getRoomById, createRoom } = require("../model/roomModel");
const { isBookmarked } = require("../model/bookmarkModel");

// ── GET ALL ROOMS (public, with filters) ──
const listRooms = async (req, res) => {
  try {
    const {
      search   = "",
      type     = "",
      minRent  = null,
      maxRent  = null,
      facilities = "",
      page     = 1,
      limit    = 9,
    } = req.query;

    const parsedFacilities = facilities
      ? facilities.split(",").filter(Boolean)
      : [];

    const data = await getRooms({
      search,
      type,
      minRent:    minRent    ? Number(minRent)  : null,
      maxRent:    maxRent    ? Number(maxRent)   : null,
      facilities: parsedFacilities,
      page:       Number(page),
      limit:      Number(limit),
    });

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET SINGLE ROOM ──
const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await getRoomById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if current user has bookmarked this room
    let bookmarked = false;
    if (req.user) {
      bookmarked = await isBookmarked(req.user.id, id);
    }

    res.json({ ...room, bookmarked });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { listRooms, getRoom };