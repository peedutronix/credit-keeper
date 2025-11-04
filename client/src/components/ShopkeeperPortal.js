import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Portal.css';

function ShopkeeperPortal() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/shopkeeper');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/credits/all');
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status });
      fetchOrders();
      fetchCustomers();
      setSelectedOrder(null);
      alert(`Order ${status} successfully`);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update order status');
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Shopkeeper Portal - {user?.full_name || user?.username}</h1>
        <div className="navbar-right">
          <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
          {showNotifications && (
            <div className="notifications-dropdown">
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <strong>Notifications</strong>
                <button onClick={markAllRead} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
                  Mark all read
                </button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No notifications</div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? '' : 'unread'}`}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.created_at).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          )}
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <div className="value">{orders.filter(o => o.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <div className="value">{customers.length}</div>
          </div>
          <div className="stat-card">
            <h3>Total Credit</h3>
            <div className="value">
              ₹{customers.reduce((sum, c) => sum + (c.current_credit || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Pending Orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Total Amount</th>
                <th>Credit Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No orders</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name || order.customer_username}</td>
                    <td>{order.order_type === 'remote' ? 'Remote' : 'At Shop'}</td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                    <td>₹{order.credit_amount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px', marginRight: '5px' }}
                      >
                        View
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOrderStatus(order.id, 'approved')}
                            className="btn btn-primary"
                            style={{ padding: '5px 10px', fontSize: '12px', marginRight: '5px' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOrderStatus(order.id, 'rejected')}
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Customers Credit Summary</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Credit Limit</th>
                <th>Current Credit</th>
                <th>Available Credit</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.full_name || customer.username}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>₹{customer.credit_limit.toFixed(2)}</td>
                  <td>₹{customer.current_credit.toFixed(2)}</td>
                  <td>₹{(customer.credit_limit - customer.current_credit).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Order Details #{selectedOrder.id}</h2>
              <div className="form-group">
                <strong>Customer:</strong> {selectedOrder.customer_name || selectedOrder.customer_username}
              </div>
              <div className="form-group">
                <strong>Phone:</strong> {selectedOrder.customer_phone || 'N/A'}
              </div>
              <div className="form-group">
                <strong>Order Type:</strong> {selectedOrder.order_type === 'remote' ? 'Remote' : 'At Shop'}
              </div>
              <div className="form-group">
                <strong>Total Amount:</strong> ₹{selectedOrder.total_amount.toFixed(2)}
              </div>
              <div className="form-group">
                <strong>Credit Amount:</strong> ₹{selectedOrder.credit_amount.toFixed(2)}
              </div>
              <div className="form-group">
                <strong>Status:</strong> {selectedOrder.status}
              </div>
              {selectedOrder.items && (
                <div className="form-group">
                  <strong>Items:</strong>
                  <ul>
                    {JSON.parse(selectedOrder.items).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="form-group">
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}
              <div className="form-group">
                <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
              </div>
              {selectedOrder.status === 'pending' && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleOrderStatus(selectedOrder.id, 'approved')}
                    className="btn btn-primary"
                  >
                    Approve Order
                  </button>
                  <button
                    onClick={() => handleOrderStatus(selectedOrder.id, 'rejected')}
                    className="btn btn-danger"
                  >
                    Reject Order
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopkeeperPortal;

