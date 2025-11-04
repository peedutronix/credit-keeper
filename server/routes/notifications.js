const express = require('express');
const { getDb } = require('../database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

const createNotification = (user_id, type, title, message, order_id = null) => {
  const db = getDb();
  db.run(
    'INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, ?, ?, ?, ?)',
    [user_id, type, title, message, order_id],
    (err) => {
      if (err) {
        console.error('Error creating notification:', err);
      }
    }
  );
};

// Get notifications for current user
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  db.all(
    `SELECT * FROM notifications 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [req.user.id],
    (err, notifications) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch notifications' });
      }
      res.json({ notifications });
    }
  );
});

// Mark notification as read
router.patch('/:id/read', authenticate, (req, res) => {
  const db = getDb();
  db.run(
    'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update notification' });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
});

// Mark all as read
router.patch('/read-all', authenticate, (req, res) => {
  const db = getDb();
  db.run(
    'UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0',
    [req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update notifications' });
      }
      res.json({ message: 'All notifications marked as read' });
    }
  );
});

// Get unread count
router.get('/unread-count', authenticate, (req, res) => {
  const db = getDb();
  db.get(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0',
    [req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch unread count' });
      }
      res.json({ count: result.count });
    }
  );
});

module.exports = router;
module.exports.createNotification = createNotification;

