import pg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting migration...');
    await client.query('BEGIN');

    // ─── EXTENSIONS ────────────────────────────────────────────────
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // ─── USERS ─────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name            VARCHAR(100) NOT NULL,
        email           VARCHAR(150) UNIQUE NOT NULL,
        password        TEXT NOT NULL,
        phone           VARCHAR(20),
        role            VARCHAR(20) NOT NULL DEFAULT 'user'
                          CHECK (role IN ('user', 'landlord', 'admin')),

        -- Landlord verification
        is_verified          BOOLEAN DEFAULT FALSE,
        verification_status  VARCHAR(20) DEFAULT 'none'
                               CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected')),
        verification_docs    JSONB,
        admin_note           TEXT,

        -- Email verification
        is_email_verified   BOOLEAN DEFAULT FALSE,
        email_verify_token  TEXT,
        email_verify_expires TIMESTAMPTZ,

        -- Moderation
        is_banned       BOOLEAN DEFAULT FALSE,

        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ users table ready');

    // ─── REFRESH TOKENS ────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token       TEXT UNIQUE NOT NULL,
        expires_at  TIMESTAMPTZ NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ refresh_tokens table ready');

    // ─── ROOMS ─────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        landlord_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        title         VARCHAR(200) NOT NULL,
        description   TEXT NOT NULL,
        price         NUMERIC(10,2) NOT NULL,
        location      VARCHAR(200) NOT NULL,
        address       TEXT NOT NULL,
        room_type     VARCHAR(50) NOT NULL
                        CHECK (room_type IN ('single', 'shared', 'apartment', 'studio', 'house')),

        amenities     JSONB DEFAULT '[]',
        rules         JSONB DEFAULT '[]',
        images        JSONB DEFAULT '[]',

        is_available  BOOLEAN DEFAULT TRUE,

        -- Admin moderation
        status        VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending', 'active', 'rejected', 'removed')),
        admin_note    TEXT,
        report_count  INTEGER DEFAULT 0,

        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ rooms table ready');

    // ─── FAVORITES ─────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, room_id)
      )
    `);
    console.log('  ✅ favorites table ready');

    // ─── CHATS ─────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        landlord_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        room_id      UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        created_at   TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, landlord_id, room_id)
      )
    `);
    console.log('  ✅ chats table ready');

    // ─── MESSAGES ──────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chat_id     UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content     TEXT NOT NULL,
        is_read     BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ messages table ready');

    // ─── PASSWORD RESETS ───────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token       TEXT NOT NULL,
        expires_at  TIMESTAMPTZ NOT NULL,
        used        BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ password_resets table ready');

    // ─── REPORTS ───────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reported_by       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        room_id           UUID REFERENCES rooms(id) ON DELETE SET NULL,
        reported_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
        reason            TEXT NOT NULL,

        status            VARCHAR(20) DEFAULT 'open'
                            CHECK (status IN ('open', 'reviewed', 'resolved')),
        action_taken      VARCHAR(50),
        admin_note        TEXT,

        created_at        TIMESTAMPTZ DEFAULT NOW(),
        updated_at        TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ reports table ready');

    // ─── NOTIFICATIONS ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type        VARCHAR(50) NOT NULL,
        title       VARCHAR(200) NOT NULL,
        body        TEXT,
        is_read     BOOLEAN DEFAULT FALSE,
        link        TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ notifications table ready');

    // ─── EMAIL VERIFICATIONS ───────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token       TEXT NOT NULL,
        expires_at  TIMESTAMPTZ NOT NULL,
        used        BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('  ✅ email_verifications table ready');

    // ─── INDEXES ───────────────────────────────────────────────────
    await client.query(`CREATE INDEX IF NOT EXISTS idx_rooms_landlord    ON rooms(landlord_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_rooms_status      ON rooms(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_rooms_location    ON rooms(location)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_chat     ON messages(chat_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_favorites_user    ON favorites(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_reports_status    ON reports(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_refresh_user      ON refresh_tokens(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_password_resets_user  ON password_resets(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role        ON users(role)`);
    console.log('  ✅ Indexes created');

    // ─── SEED ADMIN ────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@roomfinder.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existing = await client.query('SELECT id FROM users WHERE email=$1', [adminEmail]);
    if (existing.rows.length === 0) {
      const hashed = await bcrypt.hash(adminPassword, 12);
      await client.query(
        `INSERT INTO users (id, name, email, password, role, is_verified, is_email_verified, verification_status)
         VALUES ($1, 'Admin', $2, $3, 'admin', TRUE, TRUE, 'approved')`,
        [uuidv4(), adminEmail, hashed]
      );
      console.log(`  ✅ Admin seeded → ${adminEmail}`);
    } else {
      console.log(`  ℹ️  Admin already exists → ${adminEmail}`);
    }

    await client.query('COMMIT');
    console.log('\n✅ Migration completed successfully!');
    console.log(`\n📋 Tables created: users, refresh_tokens, rooms, favorites, chats, messages, password_resets, reports`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();