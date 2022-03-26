const colorProduct = require('express').Router();
const {
  getAllColorProduct, addColorProduct, deleteColorProduct, editColorProduct,
} = require('../controllers/colorProduct');

colorProduct.get('/', getAllColorProduct);
colorProduct.post('/', addColorProduct);
colorProduct.patch('/:id', editColorProduct);
colorProduct.delete('/:id', deleteColorProduct);

module.exports = colorProduct;
