const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Otp = sequelize.define('otp', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email cannot be null!',
      },
      notEmpty: {
        msg: 'Email cannot be empty!',
      },
    },
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Code cannot be null!',
      },
      notEmpty: {
        msg: 'Code cannot be empty!',
      },
    },
  },
  is_expired: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Otp;
