const deliveryMethod = require('express').Router();
const {
  getDeliveryMethod, addDeliveryMethod, updateDeliveryMethod, deleteDeliveryMethod, getDeliveryById,
} = require('../controllers/deliveryMethod');

deliveryMethod.get('/', getDeliveryMethod);
deliveryMethod.get('/:id', getDeliveryById);
deliveryMethod.post('/', addDeliveryMethod);
deliveryMethod.patch('/:id', updateDeliveryMethod);
deliveryMethod.delete('/:id', deleteDeliveryMethod);

module.exports = deliveryMethod;
