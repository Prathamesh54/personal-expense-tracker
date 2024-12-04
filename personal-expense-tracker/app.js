const express = require('express');
const cron = require('node-cron');
const app = express();
const PORT = 3000;

app.use(express.json());


let expenses = [];


app.get('/', (req, res) => {
    res.send('Welcome to the Personal Expense Tracker API!');
});


app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;

    
    if (!category || !amount || !date) {
        return res.status(400).json({
            status: 'error',
            data: null,
            error: 'Category, amount, and date are required fields.',
        });
    }

  
    const newExpense = {
        id: expenses.length + 1,
        category,
        amount,
        date,
    };

    expenses.push(newExpense);

    res.status(201).json({
        status: 'success',
        data: newExpense,
        error: null,
    });
});


app.get('/expenses', (req, res) => {
    const { category, startDate, endDate } = req.query;

    let filteredExpenses = expenses;

    
    if (category) {
        filteredExpenses = filteredExpenses.filter(
            (expense) => expense.category.toLowerCase() === category.toLowerCase()
        );
    }

   
    if (startDate && endDate) {
        filteredExpenses = filteredExpenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
        });
    }

    res.status(200).json({
        status: 'success',
        data: filteredExpenses,
        error: null,
    });
});

app.get('/expenses/analysis', (req, res) => {
    if (expenses.length === 0) {
        return res.status(200).json({
            status: 'success',
            data: {
                totalSpent: 0,
                highestSpendingCategory: null,
            },
            error: null,
        });
    }

    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

   
    const categorySpending = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const highestSpendingCategory = Object.keys(categorySpending).reduce((a, b) =>
        categorySpending[a] > categorySpending[b] ? a : b
    );

    res.status(200).json({
        status: 'success',
        data: {
            totalSpent,
            highestSpendingCategory,
        },
        error: null,
    });
});

cron.schedule('0 0 * * *', () => {
    
    console.log('Running daily expense summary report...');
    const dailyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Daily Total: ${dailyTotal}`);
});


cron.schedule('0 0 * * 0', () => {
   
    console.log('Running weekly expense summary report...');
    const weeklyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Weekly Total: ${weeklyTotal}`);
});


cron.schedule('0 0 1 * *', () => {
    
    console.log('Running monthly expense summary report...');
    const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log(`Monthly Total: ${monthlyTotal}`);
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
