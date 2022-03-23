const { Sequelize } = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Product = require('./product');

const ProductImage = sequelize.define('product_image', {
  id_product: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter description',
      },
      notEmpty: {
        msg: 'Description cannot be empty!',
      },
    },
  },
});

module.exports = ProductImage;
