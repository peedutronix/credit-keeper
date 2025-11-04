const express = require('express');
const { getDb } = require('../database');
const { authenticate, authorize } = require('../middleware/auth');
const { createNotification } = require('./notifications');
const { sendNotification } = require('../websocket');
const router = express.Router();

// Create order (customer)
router.post('/', authenticate, authorize('customer'), (req, res) => {
  const { order_type, total_amount, credit_amount, items, notes } = req.body;
  const db = getDb();

  if (!order_type || !total_amount || !credit_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['remote', 'at_shop'].includes(order_type)) {
    return res.status(400).json({ error: 'Invalid order type' });
  }

  // Get shopkeeper ID (for now, get first shopkeeper)
  db.get('SELECT id FROM users WHERE role = ? LIMIT 1', ['shopkeeper'], (err, shopkeeper) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    const shopkeeper_id = shopkeeper ? shopkeeper.id : null;

    db.run(
      `INSERT INTO orders (customer_id, shopkeeper_id, order_type, total_amount, credit_amount, items, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, shopkeeper_id, order_type, total_amount, credit_amount, JSON.stringify(items || []), notes || null],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create order' });
        }

        // Create credit record
        db.run(
          'INSERT INTO credit_records (customer_id, order_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, this.lastID, credit_amount, 'credit', `Credit from order #${this.lastID}`],
          (err) => {
            if (err) console.error('Error creating credit record:', err);
          }
        );

        // Update customer current credit
        db.run(
          'UPDATE customers SET current_credit = current_credit + ? WHERE user_id = ?',
          [credit_amount, req.user.id],
          (err) => {
            if (err) console.error('Error updating customer credit:', err);
          }
        );

        // Create notification for shopkeeper
        if (shopkeeper_id) {
          const notification = {
            id: Date.now(),
            type: 'new_order',
            title: 'New Credit Order',
            message: `Customer ${req.user.username} placed a credit order of ₹${credit_amount}`,
            order_id: this.lastID,
            read: false,
            created_at: new Date().toISOString(),
          };
          createNotification(
            shopkeeper_id,
            'new_order',
            'New Credit Order',
            `Customer ${req.user.username} placed a credit order of ₹${credit_amount}`,
            this.lastID
          );
          // Send WebSocket notification
          sendNotification(shopkeeper_id.toString(), notification);
        }

        res.json({
          id: this.lastID,
          message: 'Order created successfully',
          order: {
            id: this.lastID,
            customer_id: req.user.id,
            shopkeeper_id,
            order_type,
            total_amount,
            credit_amount,
            status: 'pending',
            items,
            notes,
          },
        });
      }
    );
  });
});

// Get orders (customer - own orders)
router.get('/customer', authenticate, authorize('customer'), (req, res) => {
  const db = getDb();
  db.all(
    'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      res.json({ orders: orders.map(order => ({
        ...order,
        items: order.items ? JSON.parse(order.items) : []
      })) });
    }
  );
});

// Get orders (shopkeeper - all pending/approved orders)
router.get('/shopkeeper', authenticate, authorize('shopkeeper'), (req, res) => {
  const db = getDb();
  db.all(
    `SELECT o.*, u.username as customer_username, u.full_name as customer_name, u.phone as customer_phone
     FROM orders o
     JOIN users u ON o.customer_id = u.id
     WHERE o.status IN ('pending', 'approved')
     ORDER BY o.created_at DESC`,
    [],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }
      res.json({ orders: orders.map(order => ({
        ...order,
        items: order.items ? JSON.parse(order.items) : []
      })) });
    }
  );
});

// Update order status (shopkeeper)
router.patch('/:id/status', authenticate, authorize('shopkeeper'), (req, res) => {
  const { status } = req.body;
  const db = getDb();

  if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update order' });
        }

        // Create notification for customer
        const notification = {
          id: Date.now(),
          type: 'order_update',
          title: 'Order Status Updated',
          message: `Your order #${order.id} has been ${status}`,
          order_id: order.id,
          read: false,
          created_at: new Date().toISOString(),
        };
        createNotification(
          order.customer_id,
          'order_update',
          'Order Status Updated',
          `Your order #${order.id} has been ${status}`,
          order.id
        );
        // Send WebSocket notification
        sendNotification(order.customer_id.toString(), notification);

        // If rejected, reverse the credit
        if (status === 'rejected') {
          db.run(
            'UPDATE customers SET current_credit = current_credit - ? WHERE user_id = ?',
            [order.credit_amount, order.customer_id],
            (err) => {
              if (err) console.error('Error reversing credit:', err);
            }
          );
        }

        res.json({ message: 'Order status updated', order: { ...order, status } });
      }
    );
  });
});

module.exports = router;

