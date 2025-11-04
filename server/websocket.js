const { getDb } = require('./database');

const clients = new Map();

const setupWebSocket = (app) => {
  app.ws('/ws', (ws, req) => {
    const userId = req.query.userId;
    
    if (!userId) {
      ws.close();
      return;
    }

    clients.set(userId, ws);

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(userId);
    });
  });
};

const sendNotification = (userId, notification) => {
  const client = clients.get(userId.toString());
  if (client && client.readyState === 1) {
    client.send(JSON.stringify({
      type: 'notification',
      data: notification,
    }));
  }
};

module.exports = {
  setupWebSocket,
  sendNotification,
};

