const productImages = require('express').Router();
const {
  getAllProductImages, addImage, updateProductImage, deleteProductImage, getImagesByProduct,
} = require('../controllers/productImage');
const uploadImage = require('../helpers/upload');

productImages.get('/', getAllProductImages);
productImages.get('/:id_product', getImagesByProduct);
productImages.post('/', uploadImage('image', 10), addImage);
productImages.patch('/:id', uploadImage('image', 1), updateProductImage);
productImages.delete('/:id', deleteProductImage);

module.exports = productImages;
