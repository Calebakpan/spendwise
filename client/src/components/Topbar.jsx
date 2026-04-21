import { useLocation } from 'react-router-dom';
import './Topbar.css';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/add': 'Add Expense',
  '/profile': 'Profile',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || TITLES[Object.keys(TITLES).find(k => pathname.startsWith(k))] || 'SpendWise';

  return (
    <header className="topbar">
      <button className="topbar-menu" onClick={onMenuClick} aria-label="Menu">
        <span /><span /><span />
      </button>
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-date">
        {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </header>
  );
}
