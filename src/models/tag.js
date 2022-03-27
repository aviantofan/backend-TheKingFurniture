const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty!',
      },
    },
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,

  },
});

module.exports = Tag;
