import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import './AddExpense.css';

export default function AddExpense() {
  const navigate = useNavigate();
  return (
    <div className="page-content">
      <div className="add-header">
        <h2 className="add-title">New Expense</h2>
        <p className="add-sub">Fill in the details below to log a new expense</p>
      </div>
      <div className="card">
        <ExpenseForm onSuccess={() => navigate('/expenses')} onCancel={() => navigate('/expenses')} />
      </div>
    </div>
  );
}
