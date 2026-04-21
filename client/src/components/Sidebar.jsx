import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: <GridIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <ListIcon /> },
  { path: '/add', label: 'Add Expense', icon: <PlusIcon /> },
  { path: '/profile', label: 'Profile', icon: <UserIcon /> },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="sb-backdrop" onClick={onClose} />}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="sb-logo">Spend<span>Wise</span></div>
        <nav className="sb-nav">
          {NAV.map(n => (
            <NavLink key={n.path} to={n.path}
              className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="sb-icon">{n.icon}</span>
              {n.label}
              {n.path === '/add' && <span className="sb-new-badge">New</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sb-footer">
          {user && (
            <div className="sb-user">
              <div className="sb-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <div className="sb-user-info">
                <p className="sb-user-name">{user.name}</p>
                <p className="sb-user-email">{user.email}</p>
              </div>
            </div>
          )}
          <button className="sb-logout" onClick={handleLogout}>
            <LogoutIcon /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function ListIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function UserIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LogoutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
