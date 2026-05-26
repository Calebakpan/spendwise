import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './AddExpense.css';
import './AddIncome.css';

const SOURCES = [
    'Salary', 'Freelance', 'Business', 'Investment',
    'Gift', 'Rental Income', 'Side Hustle', 'Other'
];

export default function AddIncome() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', amount: '', source: 'Salary',
        date: new Date().toISOString().slice(0, 10), note: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title || !form.amount || !form.source || !form.date) {
            setError('Please fill in all required fields');
            return;
        }
    
        setLoading(true);
        try {
            await api.post('/income', form);
            navigate('/income');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="add-header">
                <h2 className="add-title">Add Income</h2>
                <p className="add-sub">Record money you have received</p>
            </div>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    {error && <div className="form-alert">{error}</div>}
                    <div className="ef-grid">
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input className="form-input" placeholder="e.g. Monthly salary" value={form.title} onChange={e => set('title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (₦) *</label>
                            <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Source *</label>
                            <select className="form-select" value={form.source} onChange={e => set('source', e.target.value)}>
                                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date *</label>
                            <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Note (optional)</label>
                        <textarea className="form-textarea" placeholder="Any additional details..." value={form.note} onChange={e => set('note', e.target.value)} />
                    </div>
                    <div className="ef-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/income')}>Cancel</button>
                        <button type="submit" className="btn btn-income" disabled={loading}>
                            {loading ? <span className="spinner" /> : null}
                            Add Income
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}