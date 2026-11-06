const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getSalesTrendChart,
  getAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getAllUsers,
  toggleUserStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Analytics
router.get('/analytics/overview', getDashboardAnalytics);
router.get('/analytics/sales-trend', getSalesTrendChart);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/pay', updateOrderPaymentStatus);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);

module.exports = router;
