const express = require("express");
const { addUser, login } = require("../controller/userController");

const router = express.Router();

router.post("/create", addUser);
router.post("/login", login);

module.exports = router;