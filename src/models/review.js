const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const User = require('./user');
// const Product = require('./product');

const Review = sequelize.define('review', {
  id_user: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: {
        msg: 'Invalid id_user format',
      },
      min: 0,
    },
  },
  id_product: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: {
        msg: 'Invalid id_product format',
      },
      min: 0,
    },
  },
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: {
        msg: 'Invalid rating format',
      },
      min: 1,
      max: 5,
    },
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content cannot be null!',
      },
      notEmpty: {
        msg: 'Content cannot be empty!',
      },
    },
  },
  id_parent: {
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: {
        msg: 'Invalid id_parent format',
      },
      min: 0,
    },
  },
});

Review.belongsTo(User, {
  foreignKey: 'id_user',
});
// Review.belongsTo(Product, {
//   foreignKey: 'id_product',
// });

Review.hasMany(Review, {
  as: 'Replies',
  foreignKey: {
    name: 'id_parent',
  },
});

module.exports = Review;
