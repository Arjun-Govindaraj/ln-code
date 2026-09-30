import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parse JWT token safely to check for admin privileges
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.user?.isAdmin || payload.isAdmin || false;
    } catch (err) {
      console.error('Error decoding JWT token:', err);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        {/* Ln Code Brand Logo with Enlarged Dimensions */}
        <NavLink to={token ? "/dashboard" : "/login"} onClick={closeMobileMenu} className="nav-logo">
          <img 
            src="/logo.png" 
            alt="Ln Code Logo" 
            onError={(e) => { e.target.src = '/logo.jpg'; }}
            style={{ 
              width: '48px', 
              height: '48px', 
              objectFit: 'contain',
              mixBlendMode: 'screen'
            }} 
          />
          <span className="animated-title" style={{ fontSize: '22px', fontWeight: 'bold' }}>
            Ln Code
          </span>
        </NavLink>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-hamburger-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation Group */}
        <div className={`nav-links-group ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {token && (
            <>
              <NavLink to="/dashboard" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                Home
              </NavLink>
              <NavLink to="/analytics" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                Analytics
              </NavLink>
              <NavLink to="/leaderboard" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                Leaderboard
              </NavLink>
              <NavLink to="/profile" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                Profile
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')} style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  ⚙️ Admin
                </NavLink>
              )}
            </>
          )}

          <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
            Contact
          </NavLink>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="theme-btn"
          >
            {isDarkMode ? '🌞 Light' : '🌙 Dark'}
          </button>

          {token ? (
            <button onClick={handleLogout} className="btn logout-nav-btn">
              Logout
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMobileMenu} className="btn login-nav-btn">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;