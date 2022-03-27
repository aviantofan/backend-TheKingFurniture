const Sequelize = require('sequelize');
const argon = require('argon2');
const sequelize = require('../helpers/sequelize');
const Role = require('./role');
const { passwordValidation } = require('../helpers/validator');

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: {
      msg: 'Email has already used',
    },
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
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password cannot be null!',
      },
      notEmpty: {
        msg: 'Password cannot be empty!',
      },
    },
  },
  gender: {
    type: Sequelize.ENUM(['male', 'female']),
  },
  store_name: {
    type: Sequelize.STRING,
  },
  store_description: {
    type: Sequelize.STRING,
  },
  picture: {
    type: Sequelize.STRING,
  },
  id_role: {
    type: Sequelize.INTEGER,
    defaultValue: 3,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

// eslint-disable-next-line consistent-return
User.beforeValidate((user) => {
  if (!passwordValidation(user.password)) { return Promise.reject(new Error('Password must include 1 uppercase, 1 lowercase, 1 number and at least 8 characters long')); }
});

User.beforeCreate(async (user) => {
  const hash = await argon.hash(user.password);
  if (user.password.length < 95) {
  // eslint-disable-next-line no-param-reassign
    user.password = hash;
  }
});
User.beforeUpdate(async (user) => {
  const hash = await argon.hash(user.password);
  if (user.password.length < 95) {
  // eslint-disable-next-line no-param-reassign
    user.password = hash;
  }
});

User.belongsTo(Role, {
  foreignKey: {
    name: 'id_role',
    allowNull: false,
    defaultValue: 3,
  },
});

module.exports = User;
