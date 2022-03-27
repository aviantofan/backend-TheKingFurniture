const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Product = require('./product');

const Transaction = sequelize.define('transaction', {
  id_product: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  qty: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: Sequelize.INTEGER,
  },
  id_user: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  recipient_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name cannot be null!',
      },
      notEmpty: {
        msg: 'Name cannot be empty!',
      },
    },
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Adress cannot be null!',
      },
      notEmpty: {
        msg: 'Adress cannot be empty!',
      },
    },
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  id_payment_method: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  id_delivery_method: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  id_transaction_status: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    defaultValue: 1,
    allowNull: false,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
  },
});

module.exports = Transaction;
