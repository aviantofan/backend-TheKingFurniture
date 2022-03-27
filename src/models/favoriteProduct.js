const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Product = require('./product');
const User = require('./user');

const FavoriteProduct = sequelize.define('favorite_product', {
  id_product: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: Product,
    //   key: 'id',
    // },
  },
  id_user: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: User,
    //   key: 'id',
    // },
  },
});

module.exports = FavoriteProduct;
