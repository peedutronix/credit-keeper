import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerPortal from './components/CustomerPortal';
import ShopkeeperPortal from './components/ShopkeeperPortal';
import AdminPortal from './components/AdminPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/customer/*" element={<CustomerPortal />} />
      <Route path="/shopkeeper/*" element={<ShopkeeperPortal />} />
      <Route path="/admin/*" element={<AdminPortal />} />
      <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

