const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getStats
} = require('../controllers/expenseController');

router.use(auth);

router.get('/stats', getStats);
router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', upload.single('receipt'), createExpense);
router.put('/:id', upload.single('receipt'), updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
