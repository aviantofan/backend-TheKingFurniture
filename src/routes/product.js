const product = require('express').Router();

const productController = require('../controllers/product');

product.get('/', productController.getAllProduct);
product.post('/', productController.createProduct);
product.patch('/:id', productController.updateProduct);
product.get('/:id', productController.productDetail);
product.patch('/delete/:id', productController.deleteProduct);

module.exports = product;
