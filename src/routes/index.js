const routes = require('express').Router();
const responseHandler = require('../helpers/responseHandler');

routes.use('/auth', require('./auth'));
routes.use('/product', require('./product'));
routes.use('/category', require('./category'));
routes.use('/role', require('./role'));
routes.use('/size', require('./size'));
routes.use('/transaction-status', require('./transactionStatus'));
routes.use('/product', require('./product'));
routes.use('/category', require('./category'));
routes.use('/product-category', require('./productCategory'));
routes.use('/delivery-method', require('./deliveryMethod'));
routes.use('/user', require('./user'));
routes.use('/product-image', require('./productImage'));
routes.use('/transaction', require('./transaction'));
routes.use('/payment-method', require('./paymentMethod'));
routes.use('/color', require('./color'));
routes.use('/color-product', require('./colorProduct'));
routes.use('/profile', require('./profile'));
routes.use('/review', require('./review'));
routes.use('/tag', require('./tag'));
routes.use('/wishlist', require('./wishlist'));
routes.use('/favorite', require('./favoriteProduct'));

routes.get('/', (req, res) => responseHandler(res, 200, 'Backend is running well!'));

module.exports = routes;
