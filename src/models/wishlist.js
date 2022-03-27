const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Product = require('./product');
const User = require('./user');

const Wishlist = sequelize.define('user_wishlist_product', {
  id_user: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Id user cannot be null!',
      },
      notEmpty: {
        msg: 'Id user cannot be empty!',
      },
    },
  },
  id_product: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Id product cannot be null!',
      },
      notEmpty: {
        msg: 'Id product cannot be empty!',
      },
    },
  },
});

Wishlist.belongsTo(User, {
  foreignKey: 'id_user',
  allowNull: false,
});

Wishlist.belongsTo(Product, {
  foreignKey: 'id_product',
  allowNull: false,
});

module.exports = Wishlist;
