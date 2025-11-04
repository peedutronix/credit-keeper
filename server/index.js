const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
require('dotenv').config();

const app = express();
expressWs(app);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const db = require('./database');
db.initDb();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/credits', require('./routes/credits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// WebSocket for real-time notifications
const { setupWebSocket } = require('./websocket');
setupWebSocket(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

