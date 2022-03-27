const transaction = require('express').Router();
const {
  getAllTransaction, addTransaction, updateTransaction, deleteTransaction, getTransactionByUser,
  getUserCart,
  getTransactionForSeller,
} = require('../controllers/transaction');
const {
  verifyUser, checkIsAdmin, checkIsCustomer, checkIsSeller,
} = require('../helpers/auth');

transaction.get('/', verifyUser, checkIsAdmin, getAllTransaction);
transaction.get('/user', verifyUser, checkIsCustomer, getTransactionByUser);
transaction.get('/cart', verifyUser, checkIsCustomer, getUserCart);
transaction.get('/seller', verifyUser, checkIsSeller, getTransactionForSeller);
transaction.post('/', verifyUser, addTransaction);
transaction.patch('/', verifyUser, updateTransaction);
transaction.patch('/:id', verifyUser, updateTransaction);
transaction.patch('/delete/:id', verifyUser, checkIsCustomer, deleteTransaction);

module.exports = transaction;
