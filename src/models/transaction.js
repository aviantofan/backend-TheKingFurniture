const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Transaction = sequelize.define('transaction', {
  id_user: {
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
  id_payment_method: {
    type: Sequelize.INTEGER,
  },
  id_delivery_method: {
    type: Sequelize.INTEGER,
  },
  id_transaction_status: {
    type: Sequelize.INTEGER,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Transaction;
