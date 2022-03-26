const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Color = require('./color');
const Product = require('./product');

const ColorProduct = sequelize.define('color_product', {
  id_product: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'id_product cannot be null!',
      },
    },
    references: {
      model: Product,
      key: 'id',
    },
  },
  id_color: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'id_color cannot be null!',
      },
    },
    references: {
      model: Color,
      key: 'id',
    },
  },
});

module.exports = ColorProduct;
