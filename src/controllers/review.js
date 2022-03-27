const Sequelize = require('sequelize');
const responseHandler = require('../helpers/responseHandler');
const { inputValidator } = require('../helpers/validator');
const Product = require('../models/product');
const Review = require('../models/review');
const User = require('../models/user');

exports.getAllReviews = async (req, res) => {
  try {
    const results = await Review.findAll({
      where: {
        id_parent: null,
      },
      attributes: ['id', 'id_user', 'id_product', 'rating', 'content', 'id_parent'],
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Product,
          attributes: ['name'],
        },
        {
          model: Review,
          attributes: ['id', 'id_user', 'content'],
          as: 'Replies',
        },
      ],
    });
    return responseHandler(res, 200, 'List all reviews', results);
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.detailReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByPk(id, {
    attributes: ['id', 'id_user', 'id_product', 'rating', 'content', 'id_parent'],
    include: [
      {
        model: User,
        attributes: ['name'],
      },
      {
        model: Product,
        attributes: ['name'],
      },
      {
        model: Review,
        attributes: ['id', 'id_user', 'content'],
        as: 'Replies',
      },
    ],
  });
  if (review) {
    return responseHandler(res, 200, 'Review detail', review);
  }
  return responseHandler(res, 404, 'Review not found');
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const results = await Review.findAll({
      where: {
        id_parent: null,
        id_product: idProduct,
      },
      attributes: ['id', 'id_user', 'id_product', 'rating', 'content', 'id_parent'],
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Product,
          attributes: ['name'],
        },
        {
          model: Review,
          attributes: ['id', 'id_user', 'content'],
          as: 'Replies',
        },
      ],
    });
    return responseHandler(res, 200, `List reviews in product ${idProduct}`, results);
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.createReview = async (req, res) => {
  try {
    const idUser = req.user.id;
    const fillable = [
      {
        field: 'id_product', required: true, type: 'integer',
      },
      {
        field: 'rating', required: true, type: 'integer',
      },
      {
        field: 'content', required: true, type: 'text',
      },
      {
        field: 'id_parent', required: false, type: 'integer',
      },

    ];
    const { error, data } = inputValidator(req, fillable);
    if (data.id_parent) {
      const checkReviewId = await Review.findByPk(data.id_parent);
      if (!checkReviewId) {
        error.push('id_parent not found');
      }
    }
    if (error.length > 0) {
      return responseHandler(res, 400, error);
    }

    data.id_user = idUser;

    const review = await Review.create(data);
    return responseHandler(res, 201, 'Review created!', review);
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (review) {
    // eslint-disable-next-line no-restricted-syntax
      for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          review[key] = req.body[key];
        }
      }
      await review.save();
      return responseHandler(res, 200, 'Review updated!', review);
    }
    return responseHandler(res, 404, 'Review not found!');
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByPk(id);
  if (review) {
    await review.destroy();
    return responseHandler(res, 200, 'Review Deleted!');
  }
  return responseHandler(res, 404, 'Review not found!');
};
