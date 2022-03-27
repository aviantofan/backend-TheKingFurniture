const paymentMethod = require('express').Router();
const {
  getAllPaymentMethod, createPaymentMethod, editPaymentMethod, deletePaymentMethod,
  getPaymentMethodById,
} = require('../controllers/paymentMethod');
const uploadImage = require('../helpers/upload');

paymentMethod.get('/', getAllPaymentMethod);
paymentMethod.get('/:id', getPaymentMethodById);
paymentMethod.post('/', uploadImage('image', 1), createPaymentMethod);
paymentMethod.patch('/:id', uploadImage('image', 1), editPaymentMethod);
paymentMethod.delete('/:id', deletePaymentMethod);

module.exports = paymentMethod;
