const pool = require('../config/db');

exports.getExpenses = async (req, res) => {
  try {
    const { category, month, year, sort = 'date', order = 'DESC', search } = req.query;
    let query = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [req.user.id];

    if (category) { query += ' AND category = ?'; params.push(category); }
    if (month) { query += ' AND MONTH(date) = ?'; params.push(month); }
    if (year) { query += ' AND YEAR(date) = ?'; params.push(year); }
    if (search) { query += ' AND (title LIKE ? OR note LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const allowed = ['date', 'amount', 'title', 'category'];
    const sortCol = allowed.includes(sort) ? sort : 'date';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortCol} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    if (!title || !amount || !category || !date)
      return res.status(400).json({ message: 'Title, amount, category and date are required' });

    const receipt = req.file ? req.file.filename : null;
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, title, amount, category, date, note, receipt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, parseFloat(amount), category, date, note || null, receipt]
    );
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const [existing] = await pool.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) return res.status(404).json({ message: 'Expense not found' });

    const receipt = req.file ? req.file.filename : existing[0].receipt;
    await pool.query(
      'UPDATE expenses SET title=?, amount=?, category=?, date=?, note=?, receipt=? WHERE id=? AND user_id=?',
      [title, parseFloat(amount), category, date, note || null, receipt, req.params.id, req.user.id]
    );
    const [updated] = await pool.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = req.query.year || new Date().getFullYear();

    const [total] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM expenses WHERE user_id = ?',
      [userId]
    );

    const [byCategory] = await pool.query(
      'SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses WHERE user_id = ? GROUP BY category ORDER BY total DESC',
      [userId]
    );

    const [byMonth] = await pool.query(
      'SELECT MONTH(date) as month, SUM(amount) as total FROM expenses WHERE user_id = ? AND YEAR(date) = ? GROUP BY MONTH(date) ORDER BY month',
      [userId, year]
    );

    const [recent] = await pool.query(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 5',
      [userId]
    );

    const [thisMonth] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())',
      [userId]
    );

    const [lastMonth] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(date) = YEAR(CURDATE() - INTERVAL 1 MONTH)',
      [userId]
    );

    res.json({
      total: total[0],
      byCategory,
      byMonth,
      recent,
      thisMonth: thisMonth[0].total,
      lastMonth: lastMonth[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
