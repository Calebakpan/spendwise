const router = require('express').Router();
const auth = require('../middleware/auth');
const {
    getIncome, createIncome, updateIncome, deleteIncome, getIncomeStats
} = require('../controllers/incomeController');

router.use(auth);

router.get('/stats', getIncomeStats);
router.get('/', getIncome);
router.post('/', createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;