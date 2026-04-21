export const CATEGORIES = [
  { value: 'Food & Dining', color: '#f59e0b', icon: '🍔' },
  { value: 'Transport', color: '#3b82f6', icon: '🚗' },
  { value: 'Shopping', color: '#8b5cf6', icon: '🛍️' },
  { value: 'Entertainment', color: '#ec4899', icon: '🎬' },
  { value: 'Health', color: '#10b981', icon: '💊' },
  { value: 'Housing', color: '#f97316', icon: '🏠' },
  { value: 'Education', color: '#06b6d4', icon: '📚' },
  { value: 'Utilities', color: '#64748b', icon: '💡' },
  { value: 'Travel', color: '#84cc16', icon: '✈️' },
  { value: 'Other', color: '#94a3b8', icon: '📦' },
];

export const getCategoryMeta = (cat) =>
  CATEGORIES.find(c => c.value === cat) || { value: cat, color: '#94a3b8', icon: '📦' };

export const formatCurrency = (amount, currency = '₦') =>
  `${currency}${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
