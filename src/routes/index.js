const routes = require('express').Router();
const responseHandler = require('../helpers/responseHandler');

routes.use('/product', require('./product'));
routes.use('/category', require('./category'));
routes.use('/product-category', require('./productCategory'));
routes.use('/delivery-method', require('./deliveryMethod'));
routes.use('/product-image', require('./productImage'));

routes.get('/', (req, res) => responseHandler(res, 200, 'Backend is running well!'));

module.exports = routes;
