import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIncome } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/helpers';
import api from '../utils/api';
import './Income.css';

const SOURCE_ICONS = {
    'Salary': '💼', 'Freelance': '💻', 'Business': '🏢',
    'Investment': '📈', 'Gift': '🎁', 'Rental Income': '🏠',
    'Side Hustle': '⚡', 'Other': '💰'
};

export default function Income() {
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState(null);
    const { income, loading, refetch } = useIncome({ search });

    const total = income.reduce((s, i) => s + parseFloat(i.amount), 0);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/income/${id}`);
            setDeleting(null);
            refetch();
        } catch {
            alert('Failed to delete income');
        }
    };

    return (
        <div className="page-content">
            {deleting && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleting(null)}>
                    <div className="modal-box modal-confirm">
                        <h3>Delete Income</h3>
                        <p>Are you sure you want to delete <strong>{deleting.title}</strong>?</p>
                        <div className="modal-confirm-btns">
                            <button className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleting.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="inc-controls">
                <input className="form-input inc-search" placeholder="Search income..." value={search} onChange={e => setSearch(e.target.value)} />
                <Link to="/add-income" className="btn btn-income">+ Add Income</Link>
            </div>

            {income.length > 0 && (
                <div className="inc-summary">
                    <span>{income.length} record{income.length !== 1 ? 's' : ''}</span>
                    <span>Total: <strong>{formatCurrency(total)}</strong></span>
                </div>
            )}

            {loading ? (
                <div className="exp-loading">Loading...</div>
            ) : income.length === 0 ? (
                <div className="exp-empty">
                    <div className="exp-empty-icon">💰</div>
                    <p>No income records yet</p>
                    <Link to="/add-income" className="btn btn-income" style={{ marginTop: '0.8rem' }}>Add your first income</Link>
                </div>
            ) : (
                <div className="exp-list">
                    {income.map(item => (
                        <div key={item.id} className="inc-item">
                            <div className="inc-icon">{SOURCE_ICONS[item.source] || '💰'}</div>
                            <div className="exp-info">
                                <div className="exp-title">{item.title}</div>
                                <div className="exp-meta">
                                    <span className="inc-source-badge">{item.source}</span>
                                    <span>{formatDate(item.date)}</span>
                                    {item.note && <span className="exp-note">{item.note}</span>}
                                </div>
                            </div>
                            <div className="inc-amount">{formatCurrency(item.amount)}</div>
                            <div className="exp-actions">
                                <button className="exp-action-btn delete" onClick={() => setDeleting(item)} title="Delete">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}