// controller/userController.js

const bcrypt     = require("bcrypt");
const jwt        = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const {
  createUser,
  findUserByEmail,
  findUserByResetToken,
  activateUser,
  setResetToken,
  resetPassword,
} = require("../model/userModel");

// ── Email Transporter ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── REGISTER ──
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow user or landlord
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(name, email, hashedPassword, role || "user");

    // Generate activation token
    const activationToken = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send activation email
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: "RoomFinder — Activate your account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #2b7fff;">Welcome to RoomFinder, ${name}!</h2>
          <p>You registered as a <strong>${role || "user"}</strong>.</p>
          <p>Click the button below to activate your account:</p>
          <a href="http://localhost:5000/api/v1/users/activate/${activationToken}"
            style="background:#2b7fff; color:white; padding:12px 24px;
                   text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">
            Activate Account
          </a>
          <p style="color:#999; margin-top:20px;">This link expires in 24 hours.</p>
        </div>
      `,
    });

    res.status(201).json({
      message: `Registration successful! Please check ${email} to activate your account.`,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ── ACTIVATE ACCOUNT ──
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

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(400).json({ message: "Please activate your account first" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
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

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "No account found with this email" });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await setResetToken(email, resetToken, expires);

    // Send reset email
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: "RoomFinder — Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #2b7fff;">Reset Your Password</h2>
          <p>We received a request to reset your RoomFinder password.</p>
          <p>Click the button below to reset it:</p>
          <a href="http://localhost:5173/reset-password/${resetToken}"
            style="background:#2b7fff; color:white; padding:12px 24px;
                   text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">
            Reset Password
          </a>
          <p style="color:#999; margin-top:20px;">This link expires in 1 hour.</p>
          <p style="color:#999;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });

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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token in database
    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    // Check expiry
    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ message: "Reset link has expired." });
    }

    // Hash new password
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await resetPassword(decoded.email, hashedPassword);

    res.json({ message: "Password reset successful! You can now log in." });

  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Invalid or expired reset link." });
  }
};

module.exports = {
  register,
  activate,
  login,
  forgotPassword,
  resetPasswordController,
};