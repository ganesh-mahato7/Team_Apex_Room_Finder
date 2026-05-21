const bcrypt      = require("bcrypt");
const jwt         = require("jsonwebtoken");
const nodemailer  = require("nodemailer");

const {
  createUser,
  findUserByEmail,
  activateUser,
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

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await createUser(name, email, hashedPassword, role || "user");

    // Generate activation token (expires in 1 day)
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
        <h2>Welcome to RoomFinder, ${name}!</h2>
        <p>Click the link below to activate your account:</p>
        <a href="${process.env.CLIENT_URL}/activate/${activationToken}">
          Activate Account
        </a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res.status(201).json({
      message: "Registration successful! Please check your email to activate your account.",
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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Activate user
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

    // Check user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is activated
    if (!user.is_active) {
      return res.status(400).json({ message: "Please activate your account first" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
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


module.exports = { register, activate, login };