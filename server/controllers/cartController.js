const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate and calculate cart details
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title slug price discountPrice images stock isActive'
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], cartTotal: 0 });
  }

  // Filter out any deleted products if necessary
  cart.items = cart.items.filter((item) => item.product !== null);
  return cart;
};

// @desc    Get logged in user's cart
// @route   GET /api/v1/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or increment
// @route   POST /api/v1/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error('Product ID is required');
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found or inactive');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const qtyToAdd = Number(quantity);

    if (existingItemIndex > -1) {
      const newTotalQty = cart.items[existingItemIndex].quantity + qtyToAdd;
      if (newTotalQty > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items currently in stock`);
      }
      cart.items[existingItemIndex].quantity = newTotalQty;
      cart.items[existingItemIndex].price = effectivePrice;
    } else {
      if (qtyToAdd > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items currently in stock`);
      }
      cart.items.push({
        product: productId,
        quantity: qtyToAdd,
        price: effectivePrice
      });
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of item in cart
// @route   PUT /api/v1/cart/items/:productId
// @access  Private
const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);
    if (!qty || qty < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (qty > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    cart.items[itemIndex].quantity = qty;
    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/v1/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.cartTotal = 0;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items: [], cartTotal: 0 }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};

