const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const paymentAdapter = require('../services/paymentAdapter');

// @desc    Create a new order (COD Default / Modular)
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items found');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    // Server-side validation of stock and price security
    const verifiedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        res.status(404);
        throw new Error(`Product not found or unavailable`);
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for "${product.title}". Only ${product.stock} available.`);
      }

      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += unitPrice * item.quantity;

      verifiedOrderItems.push({
        product: product._id,
        title: product.title,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
        price: unitPrice
      });

      // Deduct inventory stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Tax calculation (5% standard GST)
    const taxPrice = Math.round(itemsPrice * 0.05);

    // Shipping fee: Free above ₹999, else ₹99
    const shippingPrice = itemsPrice >= 999 ? 0 : 99;

    // Total price
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Determine initial payment status
    const isCOD = paymentMethod.toUpperCase() === 'COD';

    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: isCOD ? 'Pending' : 'Pending',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'Processing',
      isPaid: false
    });

    // Clear user cart upon successful order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], cartTotal: 0 });

    // Initialize payment via payment adapter
    const paymentResult = await paymentAdapter.initializePayment(order, paymentMethod);

    res.status(201).json({
      success: true,
      message: isCOD
        ? 'Order placed successfully with Cash on Delivery!'
        : 'Order created, proceed to payment.',
      data: {
        order,
        payment: paymentResult
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Verify customer owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this order');
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
