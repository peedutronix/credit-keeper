import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Portal.css';

function AdminPortal() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [creditLimit, setCreditLimit] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchCustomers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleUpdateCreditLimit = async (customerId) => {
    try {
      await axios.patch(`/api/customers/${customerId}/credit-limit`, {
        credit_limit: parseFloat(creditLimit),
      });
      setSelectedCustomer(null);
      setCreditLimit('');
      fetchCustomers();
      alert('Credit limit updated successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update credit limit');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Admin Portal - {user?.full_name || user?.username}</h1>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
      </nav>

      <div className="container">
        {stats && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Total Customers</h3>
              <div className="value">{stats.total_customers}</div>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <div className="value">{stats.total_orders}</div>
            </div>
            <div className="stat-card">
              <h3>Total Credit</h3>
              <div className="value">₹{stats.total_credit.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <div className="value">{stats.pending_orders}</div>
            </div>
          </div>
        )}

        <div className="card">
          <h2>All Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'admin' ? 'status-completed' : user.role === 'shopkeeper' ? 'status-approved' : 'status-pending'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.full_name || 'N/A'}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Customers Credit Management</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Credit Limit</th>
                <th>Current Credit</th>
                <th>Available Credit</th>
                <th>Actions</th>
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
                  <td>
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCreditLimit(customer.credit_limit);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Set Limit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Update Credit Limit</h2>
              <div className="form-group">
                <label>Customer: {selectedCustomer.full_name || selectedCustomer.username}</label>
              </div>
              <div className="form-group">
                <label>Current Credit Limit: ₹{selectedCustomer.credit_limit.toFixed(2)}</label>
              </div>
              <div className="form-group">
                <label>New Credit Limit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleUpdateCreditLimit(selectedCustomer.id)}
                  className="btn btn-primary"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCreditLimit('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;

