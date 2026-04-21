import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import { useStats } from '../hooks/useExpenses';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const { stats } = useStats();

  return (
    <div className="page-content">
      <div className="profile-hero card">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="card ps-card">
          <div className="ps-label">Total Expenses Logged</div>
          <div className="ps-value">{stats?.total?.count || 0}</div>
        </div>
        <div className="card ps-card">
          <div className="ps-label">Total Amount Spent</div>
          <div className="ps-value">{formatCurrency(stats?.total?.total || 0)}</div>
        </div>
        <div className="card ps-card">
          <div className="ps-label">This Month</div>
          <div className="ps-value">{formatCurrency(stats?.thisMonth || 0)}</div>
        </div>
        <div className="card ps-card">
          <div className="ps-label">Top Category</div>
          <div className="ps-value">{stats?.byCategory?.[0]?.category || '—'}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Spending by category</div>
        {stats?.byCategory?.length ? (
          <div className="profile-cat-list">
            {stats.byCategory.map((c, i) => {
              const pct = stats.total?.total ? (c.total / stats.total.total) * 100 : 0;
              const colors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#ec4899','#06b6d4','#84cc16','#f97316','#64748b'];
              const color = colors[i % colors.length];
              return (
                <div key={i} className="pcl-item">
                  <div className="pcl-top">
                    <span className="pcl-name">{c.category}</span>
                    <span className="pcl-amount">{formatCurrency(c.total)}</span>
                    <span className="pcl-pct">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="pcl-bar-track">
                    <div className="pcl-bar" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet — add some expenses!</p>}
      </div>
    </div>
  );
}
