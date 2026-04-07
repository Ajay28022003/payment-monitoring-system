import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/auth/AdminLogin';
import Orders from './pages/Orders';
import FollowUps from './pages/FollowUps';
import Reports from './pages/Reports';
import Customers from './pages/masters/Customers';
import Partners from './pages/masters/Partners';
import Products from './pages/masters/Products';
import Users from './pages/masters/Users';
import Departments from './pages/masters/Departments';
import Designations from './pages/masters/Designations';
import Settings from './pages/Settings';

export default function App() {
  // 1. Initialize state by checking localStorage first
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('paytrack_userRole') || null;
  });

  // 2. Wrap the login function to save to localStorage
  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem('paytrack_userRole', role);
  };

  // 3. Wrap the logout function to clear localStorage
  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('paytrack_userRole');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth/admin"
          element={!userRole ? <AdminLogin onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />}
        />

        {/* Redirect root to admin login if not logged in */}
        <Route
          path="/login"
          element={<Navigate to="/auth/admin" replace />}
        />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={userRole ? <AppLayout userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/auth/admin" replace />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders userRole={userRole} />} />
          <Route path="followups" element={<FollowUps />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="masters" >
            <Route path="customers" element={<Customers />} />
            <Route path="partners" element={<Partners />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
            <Route path="departments" element={<Departments />} />
            <Route path="designations" element={<Designations />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}