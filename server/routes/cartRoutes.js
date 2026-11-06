const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All cart routes require authentication

router.route('/')
  .get(getCart);

router.route('/items')
  .post(addToCart);

router.route('/items/:productId')
  .put(updateCartItemQuantity)
  .delete(removeFromCart);

router.route('/clear')
  .delete(clearCart);

module.exports = router;
