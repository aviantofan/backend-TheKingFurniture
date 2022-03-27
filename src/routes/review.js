const review = require('express').Router();
const { verifyUser } = require('../helpers/auth');
const reviewController = require('../controllers/review');

review.get('/', reviewController.getAllReviews);
review.get('/product/:idProduct', reviewController.getReviewsByProduct);
review.post('/', verifyUser, reviewController.createReview);
review.patch('/:id', verifyUser, reviewController.updateReview);
review.get('/:id', reviewController.detailReview);
review.delete('/:id', verifyUser, reviewController.deleteReview);

module.exports = review;
