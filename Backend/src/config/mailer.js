import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: Number(env.mail.port),
  secure: Number(env.mail.port) === 465,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error('❌ Mail transporter error:', err.message);
  } else {
    console.log('✅ Mail server ready');
  }
});

export default transporter;