const product = require('express').Router();

const productController = require('../controllers/product');
const uploadImage = require('../helpers/upload');

product.get('/', productController.getAllProduct);
product.post('/', uploadImage('image', 10), productController.createProduct);
product.patch('/:id', uploadImage('image', 10), productController.updateProduct);
product.get('/:id', productController.productDetail);
product.patch('/delete/:id', productController.deleteProduct);

module.exports = product;
