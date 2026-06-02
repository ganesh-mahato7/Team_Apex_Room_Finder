// Backend/utils/sendEmail.js
// Reusable email helper used by all controllers

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Send Activation Email ──
const sendActivationEmail = async (name, email, token) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_USER,
    to:      email,
    subject: "RoomFinder — Activate your account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #2b7fff;">Welcome to RoomFinder, ${name}!</h2>
        <p>Click the button below to activate your account:</p>
        <a href="http://localhost:5000/api/v1/users/activate/${token}"
          style="background:#2b7fff; color:white; padding:12px 24px;
                 text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">
          Activate Account
        </a>
        <p style="color:#999; margin-top:20px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

// ── Send Password Reset Email ──
const sendResetEmail = async (email, token) => {
  await transporter.sendMail({
    from:    process.env.EMAIL_USER,
    to:      email,
    subject: "RoomFinder — Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #2b7fff;">Reset Your Password</h2>
        <p>We received a request to reset your RoomFinder password.</p>
        <a href="http://localhost:5173/reset-password/${token}"
          style="background:#2b7fff; color:white; padding:12px 24px;
                 text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">
          Reset Password
        </a>
        <p style="color:#999; margin-top:20px;">This link expires in 1 hour.</p>
        <p style="color:#999;">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendActivationEmail, sendResetEmail };