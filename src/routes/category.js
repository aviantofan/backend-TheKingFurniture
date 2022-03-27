const category = require('express').Router();

const categoryController = require('../controllers/category');

category.get('/', categoryController.getAllCategories);
category.get('/product-count', categoryController.getProductCount);
category.post('/', categoryController.createCategory);
category.patch('/:id', categoryController.updateCategory);
category.get('/:id', categoryController.detailCategory);
category.delete('/:id', categoryController.deleteCategory);

module.exports = category;
