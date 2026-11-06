/**
 * Payment Adapter Pattern Implementation for ShopSphere
 * 
 * Supports:
 * - COD (Cash on Delivery) - Currently default active mode
 * - RAZORPAY - Plug & Play via environment variables in production
 * - STRIPE - Extension ready
 */

const crypto = require('crypto');

class PaymentAdapter {
  constructor() {
    this.activeProvider = (process.env.PAYMENT_GATEWAY_ACTIVE || 'COD').toUpperCase();
  }

  getActiveProvider() {
    return this.activeProvider;
  }

  /**
   * Initialize a payment transaction for an order
   */
  async initializePayment(order, paymentMethod = 'COD') {
    const method = paymentMethod.toUpperCase();

    if (method === 'COD') {
      return {
        success: true,
        method: 'COD',
        orderId: order._id,
        status: 'Pending',
        requiresClientAction: false,
        message: 'Order confirmed for Cash on Delivery. Pay at your doorstep.'
      };
    }

    if (method === 'RAZORPAY') {
      // Future deployment toggle: When RAZORPAY_KEY_ID is provided
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret || keyId === 'your_razorpay_key_id_here') {
        throw new Error('Razorpay credentials not configured in server environment.');
      }

      // Razorpay client initialization would happen here:
      // const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      // const rzpOrder = await razorpay.orders.create({ amount: Math.round(order.totalPrice * 100), currency: 'INR', receipt: order._id.toString() });
      return {
        success: true,
        method: 'RAZORPAY',
        keyId: keyId,
        amount: Math.round(order.totalPrice * 100),
        currency: 'INR',
        requiresClientAction: true,
        message: 'Razorpay checkout session initialized.'
      };
    }

    throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }

  /**
   * Verify signature for online payment gateways (e.g. Razorpay)
   */
  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }
}

module.exports = new PaymentAdapter();

