const paymentMethod = require('express').Router();
const {
  getAllPaymentMethod, createPaymentMethod, editPaymentMethod, deletePaymentMethod,
  getPaymentMethodById,
} = require('../controllers/paymentMethod');

paymentMethod.get('/', getAllPaymentMethod);
paymentMethod.get('/:id', getPaymentMethodById);
paymentMethod.post('/', createPaymentMethod);
paymentMethod.patch('/:id', editPaymentMethod);
paymentMethod.delete('/:id', deletePaymentMethod);

module.exports = paymentMethod;
