const express = require('express');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all customers (shopkeeper/admin)
router.get('/', authenticate, authorize('shopkeeper', 'admin'), (req, res) => {
  const db = getDb();
  db.all(
    `SELECT u.id, u.username, u.email, u.full_name, u.phone, u.created_at,
            c.credit_limit, c.current_credit, c.address
     FROM users u
     JOIN customers c ON u.id = c.user_id
     ORDER BY u.created_at DESC`,
    [],
    (err, customers) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch customers' });
      }
      res.json({ customers });
    }
  );
});

// Get single customer details
router.get('/:id', authenticate, authorize('shopkeeper', 'admin'), (req, res) => {
  const db = getDb();
  db.get(
    `SELECT u.id, u.username, u.email, u.full_name, u.phone, u.created_at,
            c.credit_limit, c.current_credit, c.address
     FROM users u
     JOIN customers c ON u.id = c.user_id
     WHERE u.id = ?`,
    [req.params.id],
    (err, customer) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch customer' });
      }
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ customer });
    }
  );
});

// Update customer credit limit (shopkeeper/admin)
router.patch('/:id/credit-limit', authenticate, authorize('shopkeeper', 'admin'), (req, res) => {
  const { credit_limit } = req.body;
  const db = getDb();

  if (credit_limit === undefined || credit_limit < 0) {
    return res.status(400).json({ error: 'Valid credit limit required' });
  }

  db.run(
    'UPDATE customers SET credit_limit = ? WHERE user_id = ?',
    [credit_limit, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update credit limit' });
      }
      res.json({ message: 'Credit limit updated successfully' });
    }
  );
});

module.exports = router;

