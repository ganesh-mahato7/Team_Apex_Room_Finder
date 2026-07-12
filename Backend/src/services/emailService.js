import transporter from '../config/mailer.js';
import { env } from '../config/env.js';

const wrapTemplate = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#2563eb;padding:24px 32px;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;">🏠 RoomFinder</h1>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            If you didn't request this email, you can safely ignore it.<br/>
            © ${new Date().getFullYear()} RoomFinder. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"${env.mail.fromName}" <${env.mail.user}>`,
    to,
    subject,
    html,
  });
};

// ── Email verification on register ──────────────────────────
export const sendVerificationEmail = async (toEmail, name, token, role) => {
  const verifyLink = `${env.clientUrl}/verify-email?token=${token}`;
  const roleMsg = role === 'landlord'
    ? `<p style="font-size:14px;color:#6b7280;background:#fffbeb;padding:12px 16px;border-radius:8px;border-left:4px solid #f59e0b;">
        <strong>You registered as a Landlord.</strong> After verifying your email, you will need to submit your identity documents and property documents for admin approval before you can post rooms.
       </p>`
    : '';

  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name},</p>
    <p style="font-size:15px;color:#374151;line-height:1.6;">
      Welcome to RoomFinder! Please verify your email address to activate your account.
    </p>
    ${roleMsg}
    <div style="text-align:center;margin:28px 0;">
      <a href="${verifyLink}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
        Verify Email Address
      </a>
    </div>
    <p style="font-size:13px;color:#6b7280;">This link expires in <strong>24 hours</strong>.</p>
    <p style="font-size:13px;color:#6b7280;word-break:break-all;">
      Or copy: <a href="${verifyLink}" style="color:#2563eb;">${verifyLink}</a>
    </p>`;

  await sendMail({ to: toEmail, subject: 'Verify your RoomFinder email', html: wrapTemplate('Email Verification', body) });
};

// ── Welcome after verification ──────────────────────────────
export const sendWelcomeEmail = async (toEmail, name, role) => {
  const nextStep = role === 'landlord'
    ? `<p style="font-size:14px;color:#374151;">Your next step is to <strong>submit your verification documents</strong> (ID + selfie + land/building documents) so our admin team can approve your landlord account.</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${env.clientUrl}/user/profile" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">Submit Documents →</a>
       </div>`
    : `<p style="font-size:14px;color:#374151;">Start browsing available rooms and find your perfect home!</p>
       <div style="text-align:center;margin:20px 0;">
         <a href="${env.clientUrl}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">Browse Rooms →</a>
       </div>`;

  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name}, welcome to RoomFinder! 🎉</p>
    <p style="font-size:15px;color:#374151;">Your email has been verified successfully.</p>
    ${nextStep}`;

  await sendMail({ to: toEmail, subject: 'Welcome to RoomFinder!', html: wrapTemplate('Welcome', body) });
};

// ── Password reset ───────────────────────────────────────────
export const sendResetPasswordEmail = async (toEmail, name, resetToken) => {
  const resetLink = `${env.mail.resetPasswordUrl}?token=${resetToken}`;
  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name},</p>
    <p style="font-size:15px;color:#374151;line-height:1.6;">
      We received a request to reset your RoomFinder password. This link expires in <strong>30 minutes</strong>.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetLink}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">Reset Password</a>
    </div>
    <p style="font-size:13px;color:#6b7280;word-break:break-all;">
      Or copy: <a href="${resetLink}" style="color:#2563eb;">${resetLink}</a>
    </p>`;

  await sendMail({ to: toEmail, subject: 'Reset your RoomFinder password', html: wrapTemplate('Reset Password', body) });
};

// ── Password changed confirmation ────────────────────────────
export const sendPasswordChangedEmail = async (toEmail, name) => {
  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name},</p>
    <p style="font-size:15px;color:#374151;line-height:1.6;">
      Your RoomFinder password was changed successfully. If you did not make this change, contact us immediately.
    </p>`;
  await sendMail({ to: toEmail, subject: 'Your RoomFinder password was changed', html: wrapTemplate('Password Changed', body) });
};

// ── Landlord approval/rejection ─────────────────────────────
export const sendLandlordApprovedEmail = async (toEmail, name) => {
  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name},</p>
    <p style="font-size:15px;color:#374151;">🎉 Your landlord account has been <strong style="color:#15803d;">approved</strong>!</p>
    <p style="font-size:14px;color:#374151;">You can now post rooms on RoomFinder.</p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${env.clientUrl}/landlord/add-room" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">Post Your First Room →</a>
    </div>`;
  await sendMail({ to: toEmail, subject: 'Your landlord account is approved!', html: wrapTemplate('Account Approved', body) });
};

export const sendLandlordRejectedEmail = async (toEmail, name, reason) => {
  const body = `
    <p style="font-size:15px;color:#374151;">Hi ${name},</p>
    <p style="font-size:15px;color:#374151;">Unfortunately, your landlord verification was <strong style="color:#dc2626;">rejected</strong>.</p>
    ${reason ? `<p style="font-size:14px;color:#6b7280;background:#fef2f2;padding:12px;border-radius:8px;">Reason: ${reason}</p>` : ''}
    <p style="font-size:14px;color:#374151;">You can resubmit your documents from your profile page.</p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${env.clientUrl}/user/profile" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">Resubmit Documents →</a>
    </div>`;
  await sendMail({ to: toEmail, subject: 'Landlord verification update', html: wrapTemplate('Verification Update', body) });
};