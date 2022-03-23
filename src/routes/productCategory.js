const productCategory = require('express').Router();

const {
  getAllProductCategory, createProductCategory, updateProductCategory, deleteProductCategory,
} = require('../controllers/productCategory');

productCategory.get('/', getAllProductCategory);
productCategory.post('/', createProductCategory);
productCategory.patch('/:id', updateProductCategory);
productCategory.patch('/delete/:id', deleteProductCategory);

module.exports = productCategory;
