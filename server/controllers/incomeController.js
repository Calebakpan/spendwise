const pool = require('../config/db');

exports.getIncome = async (req, res) => {
    try {
        const { month, year, search } = req.query;
        let query = 'SELECT * FROM income WHERE user_id = ?';
        const params = [req.user.id];
        if (month) { query += ' AND MONTH(date) = ?'; params.push(month); }
        if (year) { query += ' AND YEAR(date) = ?'; params.push(year); }
        if (search) { query += ' AND (title LIKE ? OR note LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        query += ' ORDER BY date DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createIncome = async (req, res) => {
    try {
        const { title, amount, source, date, note } = req.body;
        if (!title || !amount || !source || !date)
            return res.status(400).json({ message: 'Title, amount, source and date are required' });
            const [result] = await pool.query(
                'INSERT INTO income (user_id, title, amount, source, date, note) VALUES (?, ?, ?, ?, ?, ?)',
                [req.user.id, title, parseFloat(amount), source, date, note || null]
            );
            const [rows] = await pool.query('SELECT * FROM income WHERE id = ?', [result.insertId]);
            res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { title, amount, source, date, note } = req.body;
        const [existing] = await pool.query(
            'SELECT * FROM income WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (existing.length === 0) return res.status(404).json({ message: 'Income not found' });
        await pool.query(
            'UPDATE income SET title=?, amount=?, source=?, date=?, note=? WHERE id=? AND user_id=?',
            [title, parseFloat(amount), source, date, note || null, req.params.id, req.user.id]
        );
        const [updated] = await pool.query('SELECT * FROM income WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM income WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Income not found' });
        res.json({ message: 'Income deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getIncomeStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [total] = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM income WHERE user_id = ?',
            [userId]
        );

        const [bySource] = await pool.query(
            'SELECT source, SUM(amount) as total, COUNT(*) as count FROM income WHERE user_id = ? GROUP BY source ORDER BY total DESC',
            [userId]
        );

        const [byMonth] = await pool.query(
            'SELECT MONTH(date) as month, SUM(amount) as total FROM income WHERE user_id = ? AND YEAR(date) = YEAR(CURDATE()) GROUP BY MONTH(date) ORDER BY month',
            [userId]
        );

        const [thisMonth] = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())',
            [userId]
        );

        const [lastMonth] = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND MONTH(date) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(date) = YEAR(CURDATE() - INTERVAL 1 MONTH)',
            [userId]
        );

        res.json({
            total: total[0],
            bySource,
            byMonth,
            thisMonth: thisMonth[0].total,
            lastMonth: lastMonth[0].total,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};