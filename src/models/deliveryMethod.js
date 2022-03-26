const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const DeliveryMethod = sequelize.define('delivery_method', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter delivery method name',
      },
      notEmpty: {
        msg: 'Method cannot be empty!',
      },
    },
  },
});

module.exports = DeliveryMethod;
