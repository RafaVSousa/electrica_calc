// TransCalc - Main Application

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { NewCalculation } from './pages/NewCalculation';
import { History } from './pages/History';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';

interface User {
  email: string;
  name?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const saved = localStorage.getItem('transcalc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('transcalc_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('transcalc_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegister={handleLogin} />
            )
          }
        />

        {/* Protected routes */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/new"
            element={user ? <NewCalculation /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/calculation/:id"
            element={user ? <NewCalculation /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/history"
            element={user ? <History /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
