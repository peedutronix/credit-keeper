const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool of connections. It reads DATABASE_URL from env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Initialize Postgres tables
const initDb = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      credit_limit REAL DEFAULT 0,
      current_credit REAL DEFAULT 0
    );
  `;

  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES users(id),
      shopkeeper_id INTEGER REFERENCES users(id),
      status TEXT,
      total REAL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCreditRecordsTable = `
    CREATE TABLE IF NOT EXISTS credit_records (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES users(id),
      order_id INTEGER REFERENCES orders(id),
      amount REAL,
      type TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      order_id INTEGER REFERENCES orders(id),
      message TEXT,
      is_read BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createUsersTable);
    await client.query(createCustomersTable);
    await client.query(createOrdersTable);
    await client.query(createCreditRecordsTable);
    await client.query(createNotificationsTable);
    client.release();
    console.log('Database tables checked/created successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb: initDb,
};

