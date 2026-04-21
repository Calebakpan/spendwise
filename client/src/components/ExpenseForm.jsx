import { useState } from 'react';
import { CATEGORIES } from '../utils/helpers';
import api from '../utils/api';
import './ExpenseForm.css';

export default function ExpenseForm({ initial, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    amount: initial?.amount || '',
    category: initial?.category || CATEGORIES[0].value,
    date: initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note: initial?.note || '',
  });
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(initial?.receipt ? `/uploads/${initial.receipt}` : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceipt(file);
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.amount || !form.category || !form.date) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (receipt) fd.append('receipt', receipt);

      if (initial?.id) {
        await api.put(`/expenses/${initial.id}`, fd);
      } else {
        await api.post('/expenses', fd);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {error && <div className="form-alert">{error}</div>}

      <div className="ef-grid">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" placeholder="e.g. Lunch at restaurant" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₦) *</label>
          <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.value}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Note (optional)</label>
        <textarea className="form-textarea" placeholder="Add any extra details..." value={form.note} onChange={e => set('note', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Receipt (optional)</label>
        <div className="ef-upload-zone" onClick={() => document.getElementById('receipt-input').click()}>
          {preview ? (
            <img src={preview} alt="Receipt preview" className="ef-preview" />
          ) : (
            <div className="ef-upload-placeholder">
              <span className="ef-upload-icon">📎</span>
              <span>Click to upload receipt (image or PDF, max 5MB)</span>
            </div>
          )}
        </div>
        <input id="receipt-input" type="file" accept="image/*,.pdf" onChange={handleFile} style={{ display: 'none' }} />
        {receipt && <p className="ef-filename">{receipt.name}</p>}
      </div>

      <div className="ef-actions">
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {initial?.id ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
