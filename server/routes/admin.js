const express = require('express');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
  const db = getDb();

  db.get('SELECT COUNT(*) as total FROM users WHERE role = ?', ['customer'], (err, customerCount) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }

    db.get('SELECT COUNT(*) as total FROM orders', [], (err, orderCount) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      db.get('SELECT SUM(current_credit) as total FROM customers', [], (err, creditTotal) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch stats' });
        }

        db.get('SELECT COUNT(*) as total FROM orders WHERE status = ?', ['pending'], (err, pendingCount) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch stats' });
          }

          res.json({
            stats: {
              total_customers: customerCount.total,
              total_orders: orderCount.total,
              total_credit: creditTotal.total || 0,
              pending_orders: pendingCount.total,
            },
          });
        });
      });
    });
  });
});

// Get all users
router.get('/users', authenticate, authorize('admin'), (req, res) => {
  const db = getDb();
  db.all(
    'SELECT id, username, email, role, full_name, phone, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
      res.json({ users });
    }
  );
});

module.exports = router;

