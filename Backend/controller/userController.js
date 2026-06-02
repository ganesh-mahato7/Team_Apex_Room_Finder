// Backend/controller/userController.js

const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  activateUser,
  setResetToken,
  resetPassword,
} = require("../model/userModel");

const {
  sendActivationEmail,
  sendResetEmail,
} = require("../utils/sendEmail");

// ── Dummy hash for timing attack prevention ──
const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012";

// ── REGISTER ──
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Block admin self-registration
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password with pepper
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      password + process.env.PEPPER,
      salt
    );

    const newUser = await createUser(name, email, hashedPassword, role || "user");

    // Generate activation token
    const activationToken = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendActivationEmail(name, email, activationToken);

    res.status(201).json({
      message: `Registration successful! Please check ${email} to activate your account.`,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── ACTIVATE ──
const activate = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded   = jwt.verify(token, process.env.JWT_SECRET);
    await activateUser(decoded.email);
    res.json({ message: "Account activated successfully! You can now log in." });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Invalid or expired activation link." });
  }
};

// ── LOGIN ──
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);

    // ── Timing attack fix ──
    // Always run bcrypt.compare even if user doesn't exist
    // Makes response time consistent regardless of email validity
    const hashToCheck   = user ? user.password : DUMMY_HASH;
    const validPassword = await bcrypt.compare(
      password + process.env.PEPPER,
      hashToCheck
    );

    // ── Email enumeration fix ──
    // Same error message whether email doesn't exist OR password is wrong
    if (!user || !validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check activation
    if (!user.is_active) {
      return res.status(400).json({ message: "Please activate your account first" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── FORGOT PASSWORD ──
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(email);

    // ── Email enumeration fix ──
    // Always return same message whether email exists or not
    if (!user) {
      return res.json({ message: "Password reset link sent to your email!" });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await setResetToken(email, resetToken, expires);
    await sendResetEmail(email, resetToken);

    res.json({ message: "Password reset link sent to your email!" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── RESET PASSWORD ──
const resetPasswordController = async (req, res) => {
  try {
    const { token }       = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ message: "Reset link has expired." });
    }

    // Hash new password with pepper
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      newPassword + process.env.PEPPER,
      salt
    );

    await resetPassword(decoded.email, hashedPassword);

    res.json({ message: "Password reset successful! You can now log in." });

  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Invalid or expired reset link." });
  }
};

// ── GET PROFILE (protected) ──
const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id:         user.id,
      name:       user.name,
      email:      user.email,
      role:       user.role,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  activate,
  login,
  forgotPassword,
  resetPasswordController,
  getProfile,
};