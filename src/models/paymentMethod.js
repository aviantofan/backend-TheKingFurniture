const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const PaymentMethod = sequelize.define('payment_method', {
  name: {
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
  image: {
    type: Sequelize.STRING,
  },
});

module.exports = PaymentMethod;
