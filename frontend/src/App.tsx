import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/destinations" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/destinations" replace />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/destinations"
          element={
            <ProtectedRoute>
              <Destinations />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/destinations" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
