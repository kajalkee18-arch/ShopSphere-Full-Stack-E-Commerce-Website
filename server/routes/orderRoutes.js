const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createOrder);

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

module.exports = router;

