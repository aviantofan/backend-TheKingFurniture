const productCategory = require('express').Router();

const {
  getAllProductCategory, createProductCategory, updateProductCategory, deleteProductCategory,
  getCategoryById,
} = require('../controllers/productCategory');

productCategory.get('/', getAllProductCategory);
productCategory.get('/:id_category', getCategoryById);
productCategory.post('/', createProductCategory);
productCategory.patch('/:id', updateProductCategory);
productCategory.patch('/delete/:id', deleteProductCategory);

module.exports = productCategory;
