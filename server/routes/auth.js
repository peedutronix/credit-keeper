const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database');
const { authenticate, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, role, full_name, phone } = req.body;
  const db = getDb();

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['admin', 'shopkeeper', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, full_name || null, phone || null],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        // If customer, create customer record
        if (role === 'customer') {
          db.run('INSERT INTO customers (user_id) VALUES (?)', [this.lastID], (err) => {
            if (err) {
              console.error('Error creating customer record:', err);
            }
          });
        }

        const token = jwt.sign(
          { id: this.lastID, username, email, role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          token,
          user: {
            id: this.lastID,
            username,
            email,
            role,
            full_name,
            phone,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  const db = getDb();
  db.get('SELECT id, username, email, role, full_name, phone, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get user' });
    }
    res.json({ user });
  });
});

module.exports = router;

