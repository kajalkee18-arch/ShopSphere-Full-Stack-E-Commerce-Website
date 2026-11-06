const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createProductReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/product/:productId')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
