import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import GlobalChat from './components/GlobalChat';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LanguageSelect from './pages/LanguageSelect';
import LevelSelect from './pages/LevelSelect';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Certificate from './pages/Certificate';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.user?.isAdmin) {
      alert('Access Denied: Admin permissions required.');
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Full Viewport Navbar Sitting Outside the Centered Main Area */}
        <Navbar />
        
        {/* Centered Main Page Content Container */}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/languages" element={<ProtectedRoute><LanguageSelect /></ProtectedRoute>} />
            <Route path="/levels/:lang" element={<ProtectedRoute><LevelSelect /></ProtectedRoute>} />
            <Route path="/quiz/:lang/:level" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/certificate/:lang" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Protected Route */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        
        {/* Real-Time Floating Global Chat Widget */}
        <GlobalChat />
      </div>
    </Router>
  );
}

export default App;