import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeaderTop = ({ onAddLiveClick }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActiveRoute = (route) => location.pathname.startsWith(route);
  const handleLogout = () => logout();

  return (
    <header className="header-top" style={styles.header}>
    <div className="header-div" style={styles.headerContent}>
        {/* Left side: Logo + Nova Live */}
        <div style={styles.logoSection}>
        <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
            <div style={styles.bar1}></div>
            <div style={styles.bar2}></div>
            <div style={styles.bar3}></div>
            </div>
            <div style={styles.logoText}>
            <span style={styles.logoTextMain}>live</span>
            <span style={styles.logoTextSub}>insights</span>
            </div>
        </div>

        {/* Nova Live button - styled like nav link */}
        {onAddLiveClick && (
            <button
            className="nova-live-button"
            style={styles.novaLiveButton}
            onClick={onAddLiveClick}
            >
            Nova Live
            </button>
        )}
        </div>

        {/* Right side: Title + Nav buttons */}
        <div style={styles.headerRight}>
        <h2 style={styles.pageTitle}>Relatórios</h2>

        <div style={styles.navButtons}>
            <NavLink
            to="/client/lives"
            className={`nav-link ${isActiveRoute('/client/lives') ? 'active-link' : ''}`}
            style={styles.navLink}
            >
            Dashboard
            </NavLink>

            <button
            className="logout-button"
            style={styles.logoutButton}
            onClick={handleLogout}
            >
            Logout
            </button>
        </div>
        </div>
    </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    padding: '8px',
  },
  bar1: { width: '6px', height: '20px', backgroundColor: '#FF5722', borderRadius: '3px' },
  bar2: { width: '6px', height: '26px', backgroundColor: '#FF5722', borderRadius: '3px' },
  bar3: { width: '6px', height: '16px', backgroundColor: '#FF5722', borderRadius: '3px' },
  logoText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  logoTextMain: { fontSize: '22px', fontWeight: '700', color: '#1E293B', lineHeight: '1' },
  logoTextSub: { fontSize: '22px', fontWeight: '700', color: '#1E293B', lineHeight: '1' },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1E293B',
    margin: 0,
  },
  navButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navLink: {
    fontWeight: '500',
    textDecoration: 'none',
    color: '#334155',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    transition: 'background 0.2s ease',
  },
  logoutButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #FF5722, #9C27B0)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255,87,34,0.25)',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
    novaLiveButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #FF5722, #9C27B0)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(255,87,34,0.25)',
    transition: 'all 0.3s ease',
    },
};

export default HeaderTop;
