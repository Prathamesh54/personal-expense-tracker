const express = require('express');
const router = express.Router();

const expenses = [];


router.post('/', (req, res) => {
  const { category, amount, date } = req.body;
  const id = expenses.length + 1;
  const expense = { id, category, amount, date };
  expenses.push(expense);
  res.json({ status: 'success', data: expense, error: null });
});

router.get('/', (req, res) => {
  res.json({ status: 'success', data: expenses, error: null });
});

module.exports = router;
