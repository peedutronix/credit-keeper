import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Portal.css';

function CustomerPortal() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [creditSummary, setCreditSummary] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState('remote');
  const [totalAmount, setTotalAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [items, setItems] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchCreditSummary();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/customer');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCreditSummary = async () => {
    try {
      const response = await axios.get('/api/credits/customer/summary');
      setCreditSummary(response.data);
    } catch (error) {
      console.error('Error fetching credit summary:', error);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemsArray = items.split('\n').filter(item => item.trim());
      await axios.post('/api/orders', {
        order_type: orderType,
        total_amount: parseFloat(totalAmount),
        credit_amount: parseFloat(creditAmount),
        items: itemsArray,
        notes,
      });
      setShowOrderForm(false);
      setTotalAmount('');
      setCreditAmount('');
      setItems('');
      setNotes('');
      fetchOrders();
      fetchCreditSummary();
      alert('Order created successfully! Shopkeeper will be notified.');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Customer Portal - {user?.full_name || user?.username}</h1>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </nav>

      <div className="container">
        {creditSummary && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Credit Limit</h3>
              <div className="value">₹{creditSummary.credit_limit.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>Current Credit</h3>
              <div className="value">₹{creditSummary.current_credit.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>Available Credit</h3>
              <div className="value">₹{creditSummary.available_credit.toFixed(2)}</div>
            </div>
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Orders</h2>
            <button onClick={() => setShowOrderForm(!showOrderForm)} className="btn btn-primary">
              {showOrderForm ? 'Cancel' : 'Create New Order'}
            </button>
          </div>

          {showOrderForm && (
            <form onSubmit={handleCreateOrder} style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
              <div className="form-group">
                <label>Order Type</label>
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="remote">Remote Order</option>
                  <option value="at_shop">At Shop</option>
                </select>
              </div>
              <div className="form-group">
                <label>Total Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Credit Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Items (one per line)</label>
                <textarea
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="Tomatoes - 2kg&#10;Potatoes - 5kg&#10;Onions - 3kg"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Order'}
              </button>
            </form>
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Type</th>
                <th>Total Amount</th>
                <th>Credit Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No orders yet</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.order_type === 'remote' ? 'Remote' : 'At Shop'}</td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                    <td>₹{order.credit_amount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerPortal;

