const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (add or remove)
// @route   POST /api/v1/wishlist/toggle/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const isAlreadyBookmarked = wishlist.products.some(
      (p) => p.toString() === productId
    );

    let message;
    if (isAlreadyBookmarked) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId
      );
      message = 'Product removed from wishlist';
    } else {
      wishlist.products.push(productId);
      message = 'Product added to wishlist';
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' }
    });

    res.status(200).json({
      success: true,
      message,
      data: updatedWishlist.products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
