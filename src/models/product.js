const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const ProductCategory = require('./productCategory');

const Product = sequelize.define('product', {
  name: {
    type: Sequelize.STRING,
    unique: {
      msg: 'Product exist',
    },
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter product name',
      },
      notEmpty: {
        msg: 'Name cannot be empty!',
      },
    },
  },
  description: {
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
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please input the stock',
      },
      notEmpty: {
        msg: 'Stock cannot be empty',
      },
      isInt: true,
      isNumeric: {
        msg: 'Stock must be a number',
      },
      min: 1,
    },
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please input the price',
      },
      notEmpty: {
        msg: 'Price cannot be empty',
      },
    },
  },
  condition: {
    type: Sequelize.ENUM('New', 'Second'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please input the condition',
      },
      notEmpty: {
        msg: 'Condition cannot be empty',
      },
    },
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
  },
});

Product.hasMany(ProductCategory, { foreignKey: 'id_product' });
// Product.belongsTo(ProductCategory, { foreignKey: 'id_product', constraints: false });

module.exports = Product;
