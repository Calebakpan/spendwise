import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { getCategoryMeta, formatCurrency, formatDate, CATEGORIES } from '../utils/helpers';
import ExpenseForm from '../components/ExpenseForm';
import api from '../utils/api';
import './Expenses.css';

export default function Expenses() {
  const [filters, setFilters] = useState({ sort: 'date', order: 'DESC' });
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { expenses, loading, refetch } = useExpenses({ ...filters, search });

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setDeleting(null);
      refetch();
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <div className="page-content">
      {editing && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Expense</h3>
              <button className="modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <ExpenseForm initial={editing} onSuccess={() => { setEditing(null); refetch(); }} onCancel={() => setEditing(null)} />
          </div>
        </div>
      )}

      {deleting && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleting(null)}>
          <div className="modal-box modal-confirm">
            <h3>Delete Expense</h3>
            <p>Are you sure you want to delete <strong>{deleting.title}</strong>? This cannot be undone.</p>
            <div className="modal-confirm-btns">
              <button className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleting.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="exp-controls">
        <input className="form-input exp-search" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select exp-select" value={filters.category || ''} onChange={e => setFilter('category', e.target.value || undefined)}>
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.value}</option>)}
        </select>
        <select className="form-select exp-select" value={`${filters.sort}-${filters.order}`} onChange={e => { const [s, o] = e.target.value.split('-'); setFilter('sort', s); setFilter('order', o); }}>
          <option value="date-DESC">Newest first</option>
          <option value="date-ASC">Oldest first</option>
          <option value="amount-DESC">Highest amount</option>
          <option value="amount-ASC">Lowest amount</option>
        </select>
        <Link to="/add" className="btn btn-primary">+ Add</Link>
      </div>

      {expenses.length > 0 && (
        <div className="exp-summary">
          <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
          <span>Total: <strong>{formatCurrency(total)}</strong></span>
        </div>
      )}

      {loading ? (
        <div className="exp-loading">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">💸</div>
          <p>No expenses found</p>
          <Link to="/add" className="btn btn-primary" style={{ marginTop: '0.8rem' }}>Add your first expense</Link>
        </div>
      ) : (
        <div className="exp-list">
          {expenses.map((e) => {
            const meta = getCategoryMeta(e.category);
            return (
              <div key={e.id} className="exp-item">
                <div className="exp-icon" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.icon}</div>
                <div className="exp-info">
                  <div className="exp-title">{e.title}</div>
                  <div className="exp-meta">
                    <span className="badge" style={{ background: `${meta.color}22`, color: meta.color }}>{e.category}</span>
                    <span>{formatDate(e.date)}</span>
                    {e.note && <span className="exp-note">{e.note}</span>}
                  </div>
                </div>
                {e.receipt && (
                  <a href={`/uploads/${e.receipt}`} target="_blank" rel="noreferrer" className="exp-receipt-btn" title="View receipt">📎</a>
                )}
                <div className="exp-amount">{formatCurrency(e.amount)}</div>
                <div className="exp-actions">
                  <button className="exp-action-btn" onClick={() => setEditing(e)} title="Edit">✏️</button>
                  <button className="exp-action-btn delete" onClick={() => setDeleting(e)} title="Delete">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
