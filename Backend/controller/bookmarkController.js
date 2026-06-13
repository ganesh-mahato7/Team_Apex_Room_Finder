// controller/bookmarkController.js

const {
  getUserBookmarks,
  isBookmarked,
  addBookmark,
  removeBookmark,
} = require("../model/bookmarkModel");

// ── GET MY BOOKMARKS ──
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await getUserBookmarks(req.user.id);
    res.json({ bookmarks });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── TOGGLE BOOKMARK ──
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const alreadySaved = await isBookmarked(userId, roomId);

    if (alreadySaved) {
      await removeBookmark(userId, roomId);
      return res.json({ bookmarked: false, message: "Removed from saved rooms" });
    } else {
      await addBookmark(userId, roomId);
      return res.json({ bookmarked: true, message: "Room saved!" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMyBookmarks, toggleBookmark };