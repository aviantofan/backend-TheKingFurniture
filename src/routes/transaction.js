const transaction = require('express').Router();
const {
  getAllTransaction, addTransaction, updateTransaction, deleteTransaction,
} = require('../controllers/transaction');

transaction.get('/', getAllTransaction);
transaction.post('/', addTransaction);
transaction.patch('/', updateTransaction);
transaction.patch('/:id', updateTransaction);
transaction.patch('/delete/:id', deleteTransaction);

module.exports = transaction;
