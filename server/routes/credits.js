const express = require('express');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get credit records (customer)
router.get('/customer', authenticate, authorize('customer'), (req, res) => {
  const db = getDb();
  db.all(
    `SELECT cr.*, o.id as order_id, o.status as order_status
     FROM credit_records cr
     LEFT JOIN orders o ON cr.order_id = o.id
     WHERE cr.customer_id = ?
     ORDER BY cr.created_at DESC`,
    [req.user.id],
    (err, records) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch credit records' });
      }
      res.json({ records });
    }
  );
});

// Get customer credit summary
router.get('/customer/summary', authenticate, authorize('customer'), (req, res) => {
  const db = getDb();
  db.get(
    'SELECT credit_limit, current_credit FROM customers WHERE user_id = ?',
    [req.user.id],
    (err, customer) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch credit summary' });
      }
      res.json({
        credit_limit: customer?.credit_limit || 0,
        current_credit: customer?.current_credit || 0,
        available_credit: (customer?.credit_limit || 0) - (customer?.current_credit || 0),
      });
    }
  );
});

// Get all customers' credits (shopkeeper/admin)
router.get('/all', authenticate, authorize('shopkeeper', 'admin'), (req, res) => {
  const db = getDb();
  db.all(
    `SELECT u.id, u.username, u.full_name, u.phone, c.credit_limit, c.current_credit
     FROM users u
     JOIN customers c ON u.id = c.user_id
     ORDER BY c.current_credit DESC`,
    [],
    (err, customers) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch customers' });
      }
      res.json({ customers });
    }
  );
});

// Add payment (shopkeeper/admin)
router.post('/payment', authenticate, authorize('shopkeeper', 'admin'), (req, res) => {
  const { customer_id, amount, description } = req.body;
  const db = getDb();

  if (!customer_id || !amount) {
    return res.status(400).json({ error: 'Customer ID and amount required' });
  }

  db.run(
    'INSERT INTO credit_records (customer_id, amount, type, description) VALUES (?, ?, ?, ?)',
    [customer_id, -Math.abs(amount), 'payment', description || 'Payment received'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to record payment' });
      }

      // Update customer current credit
      db.run(
        'UPDATE customers SET current_credit = current_credit - ? WHERE user_id = ?',
        [Math.abs(amount), customer_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update credit' });
          }
          res.json({ message: 'Payment recorded successfully', record_id: this.lastID });
        }
      );
    }
  );
});

module.exports = router;

