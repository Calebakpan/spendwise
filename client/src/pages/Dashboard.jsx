import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useExpenses';
import { getCategoryMeta, formatCurrency, formatDate, MONTHS } from '../utils/helpers';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartTooltip = { backgroundColor: '#1e293b', titleColor: '#94a3b8', bodyColor: '#f1f5f9', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 10 };

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, loading } = useStats();

  if (loading) return (
    <div className="page-content">
      <div className="dash-skeleton">
        {[...Array(4)].map((_, i) => <div key={i} className="dash-skel-card skeleton" />)}
      </div>
    </div>
  );

  const diff = stats ? ((stats.thisMonth - stats.lastMonth) / (stats.lastMonth || 1)) * 100 : 0;

  const donutData = stats?.byCategory?.length ? {
    labels: stats.byCategory.map(c => c.category),
    datasets: [{
      data: stats.byCategory.map(c => parseFloat(c.total)),
      backgroundColor: stats.byCategory.map(c => getCategoryMeta(c.category).color),
      borderWidth: 2, borderColor: '#1e293b',
    }],
  } : null;

  const allMonths = MONTHS.map((m, i) => {
    const found = stats?.byMonth?.find(b => b.month === i + 1);
    return found ? parseFloat(found.total) : 0;
  });

  const barData = {
    labels: MONTHS,
    datasets: [{
      data: allMonths,
      backgroundColor: allMonths.map(v => v > 0 ? '#10b981' : '#273548'),
      borderRadius: 4, borderSkipped: false,
    }],
  };

  return (
    <div className="page-content">
      <div className="dash-greeting">
        <h2>Good {getTimeOfDay()}, <span>{user?.name?.split(' ')[0]}</span> 👋</h2>
        <p>Here's your spending overview</p>
      </div>

      <div className="dash-kpis">
        <div className="dash-kpi">
          <div className="kpi-label">Total Spent</div>
          <div className="kpi-value">{formatCurrency(stats?.total?.total || 0)}</div>
          <div className="kpi-sub">{stats?.total?.count || 0} transactions</div>
        </div>
        <div className="dash-kpi">
          <div className="kpi-label">This Month</div>
          <div className="kpi-value">{formatCurrency(stats?.thisMonth || 0)}</div>
          <div className={`kpi-sub ${diff > 0 ? 'up' : 'down'}`}>
            {diff > 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}% vs last month
          </div>
        </div>
        <div className="dash-kpi">
          <div className="kpi-label">Last Month</div>
          <div className="kpi-value">{formatCurrency(stats?.lastMonth || 0)}</div>
          <div className="kpi-sub">Previous period</div>
        </div>
        <div className="dash-kpi">
          <div className="kpi-label">Categories</div>
          <div className="kpi-value">{stats?.byCategory?.length || 0}</div>
          <div className="kpi-sub">Spending areas</div>
        </div>
      </div>

      <div className="dash-charts">
        <div className="card">
          <div className="card-title">Monthly spending</div>
          <div style={{ position: 'relative', height: 200 }}>
            <Bar data={barData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { ...chartTooltip, callbacks: { label: ctx => ` ${formatCurrency(ctx.raw)}` } } },
              scales: {
                x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false }, border: { display: false } },
                y: { ticks: { color: '#64748b', font: { size: 10 }, callback: v => `₦${(v/1000).toFixed(0)}k` }, grid: { color: 'rgba(255,255,255,0.04)' }, border: { display: false } },
              },
            }} />
          </div>
        </div>

        <div className="card">
          <div className="card-title">By category</div>
          {donutData ? (
            <>
              <div style={{ position: 'relative', height: 160, width: 160, margin: '0 auto' }}>
                <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { ...chartTooltip, callbacks: { label: ctx => ` ${ctx.label}: ${formatCurrency(ctx.raw)}` } } } }} />
              </div>
              <div className="dash-cat-legend">
                {stats.byCategory.slice(0, 5).map((c, i) => {
                  const meta = getCategoryMeta(c.category);
                  return (
                    <div key={i} className="dcl-item">
                      <span className="dcl-dot" style={{ background: meta.color }} />
                      <span className="dcl-name">{meta.icon} {c.category}</span>
                      <span className="dcl-val">{formatCurrency(c.total)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : <div className="dash-empty-cat">No expenses yet</div>}
        </div>
      </div>

      <div className="card dash-recent">
        <div className="dash-recent-header">
          <div className="card-title" style={{ margin: 0 }}>Recent expenses</div>
          <Link to="/expenses" className="dash-view-all">View all →</Link>
        </div>
        {stats?.recent?.length ? (
          <div className="dash-recent-list">
            {stats.recent.map((e, i) => {
              const meta = getCategoryMeta(e.category);
              return (
                <div key={i} className="dash-recent-item">
                  <div className="dri-icon" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.icon}</div>
                  <div className="dri-info">
                    <div className="dri-title">{e.title}</div>
                    <div className="dri-meta">{meta.icon} {e.category} · {formatDate(e.date)}</div>
                  </div>
                  <div className="dri-amount">{formatCurrency(e.amount)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="dash-empty">
            <p>No expenses yet.</p>
            <Link to="/add" className="btn btn-primary" style={{ marginTop: '0.8rem', display: 'inline-flex' }}>Add your first expense</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
