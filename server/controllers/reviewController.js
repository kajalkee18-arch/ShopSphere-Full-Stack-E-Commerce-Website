const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews for a product
// @route   GET /api/v1/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/v1/reviews/product/:productId
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Rating and comment are required');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already submitted a review for this product');
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      title: title || '',
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Allow user who created it or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  deleteReview
};

